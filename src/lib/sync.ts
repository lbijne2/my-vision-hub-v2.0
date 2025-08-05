import { Client } from '@notionhq/client'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import type { BlogPost, Project, Agent } from '@/types'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Helper function to safely get text from Notion properties
function getTextFromProperty(property: any): string {
  if (!property) return ''
  if (property.rich_text) {
    return property.rich_text.map((text: any) => text.plain_text).join('')
  }
  if (property.title) {
    return property.title.map((text: any) => text.plain_text).join('')
  }
  return ''
}

// Helper function to get tags from Notion properties
function getTagsFromProperty(property: any): string[] {
  if (!property || !property.multi_select) return []
  return property.multi_select.map((tag: any) => tag.name)
}

// Sync blog posts from Notion to Supabase
export async function syncBlogPostsToSupabase(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_BLOG_DB_ID) {
    console.warn('Notion API key or blog database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all blog posts from Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB_ID,
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
    })

    // First, get all the page IDs and basic properties
    const notionPosts = response.results.map((page: any) => {
      if (!page.properties) return null
      
      const properties = page.properties
      
      return {
        id: page.id,
        title: getTextFromProperty(properties.title),
        slug: getTextFromProperty(properties.slug),
        excerpt: getTextFromProperty(properties.excerpt),
        author: getTextFromProperty(properties.author),
        published: properties.published?.checkbox || false,
        tags: getTagsFromProperty(properties.tags),
        published_at: properties.date?.date?.start || new Date().toISOString(),
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
      }
    }).filter(Boolean)

    // Now fetch the full content for each page
    const postsWithContent = []
    for (const post of notionPosts) {
      if (!post) continue // Skip null posts
      try {
        // Fetch the full page content
        const pageResponse = await notion.pages.retrieve({ page_id: post.id })
        const blocksResponse = await notion.blocks.children.list({ block_id: post.id })
        
        // Extract content from blocks
        let content = ''
        if (blocksResponse.results) {
          content = blocksResponse.results
            .map((block: any) => {
              if (block.type === 'paragraph' && block.paragraph?.rich_text) {
                return block.paragraph.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'heading_1' && block.heading_1?.rich_text) {
                return block.heading_1.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'heading_2' && block.heading_2?.rich_text) {
                return block.heading_2.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'heading_3' && block.heading_3?.rich_text) {
                return block.heading_3.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
                return '• ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
                return '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'quote' && block.quote?.rich_text) {
                return '> ' + block.quote.rich_text.map((text: any) => text.plain_text).join('')
              } else if (block.type === 'code' && block.code?.rich_text) {
                return '```\n' + block.code.rich_text.map((text: any) => text.plain_text).join('') + '\n```'
              }
              return ''
            })
            .filter(text => text.length > 0)
            .join('\n\n')
        }
        
        postsWithContent.push({
          ...post,
          content: content || post.excerpt, // Fallback to excerpt if no content found
        })
        
        console.log(`Fetched content for: ${post.title}`)
      } catch (error) {
        console.error(`Error fetching content for ${post.title}:`, error)
        // Still add the post with excerpt as fallback
        postsWithContent.push({
          ...post,
          content: post.excerpt,
        })
      }
    }

    // Upsert each post to Supabase
    for (const post of postsWithContent) {
      const { error } = await supabase
        .from('blog_posts')
        .upsert(post, { onConflict: 'id' })

      if (error) {
        console.error(`Error syncing blog post ${post.slug}:`, error)
      } else {
        console.log(`Synced blog post: ${post.title}`)
      }
    }

    console.log(`Successfully synced ${postsWithContent.length} blog posts to Supabase`)
  } catch (error) {
    console.error('Error syncing blog posts to Supabase:', error)
  }
}

// Sync projects from Notion to Supabase
export async function syncProjectsToSupabase(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_PROJECT_DB_ID) {
    console.warn('Notion API key or project database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all projects from Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PROJECT_DB_ID,
      sorts: [
        {
          property: 'title',
          direction: 'ascending',
        },
      ],
    })

    const notionProjects = response.results.map((page: any) => {
      if (!page.properties) return null
      
      const properties = page.properties
      
      return {
        id: page.id,
        title: getTextFromProperty(properties.title),
        slug: getTextFromProperty(properties.slug),
        subtitle: getTextFromProperty(properties.subtitle),
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        cover_image_url: properties.coverImage?.files?.[0]?.file?.url || properties.coverImage?.files?.[0]?.external?.url || '',
        tags: getTagsFromProperty(properties.tags),
        status: properties.status?.select?.name || 'idea',
        github_url: properties.githubUrl?.url || '',
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
      }
    }).filter(Boolean)

    // Upsert each project to Supabase
    for (const project of notionProjects) {
      if (!project) continue // Skip null projects
      const { error } = await supabase
        .from('projects')
        .upsert(project, { onConflict: 'id' })

      if (error) {
        console.error(`Error syncing project ${project.slug}:`, error)
      } else {
        console.log(`Synced project: ${project.title}`)
      }
    }

    console.log(`Successfully synced ${notionProjects.length} projects to Supabase`)
  } catch (error) {
    console.error('Error syncing projects to Supabase:', error)
  }
}

// Sync agents from Notion to Supabase
export async function syncAgentsToSupabase(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_AGENT_DB_ID) {
    console.warn('Notion API key or agent database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all agents from Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_AGENT_DB_ID,
      sorts: [
        {
          property: 'name',
          direction: 'ascending',
        },
      ],
    })

    const notionAgents = response.results.map((page: any) => {
      if (!page.properties) return null
      
      const properties = page.properties
      
      return {
        id: page.id,
        name: getTextFromProperty(properties.name),
        slug: getTextFromProperty(properties.slug),
        status: properties.status?.select?.name || 'idea',
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        inputs: properties.inputs?.rich_text?.[0]?.plain_text?.split(',').map((s: string) => s.trim()) || [],
        tags: getTagsFromProperty(properties.tags),
        example_uses: properties.exampleUses?.rich_text?.[0]?.plain_text?.split(',').map((s: string) => s.trim()) || [],
        trigger_type: getTextFromProperty(properties.triggerType),
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
      }
    }).filter(Boolean)

    // Upsert each agent to Supabase
    for (const agent of notionAgents) {
      if (!agent) continue // Skip null agents
      const { error } = await supabase
        .from('agents')
        .upsert(agent, { onConflict: 'id' })

      if (error) {
        console.error(`Error syncing agent ${agent.slug}:`, error)
      } else {
        console.log(`Synced agent: ${agent.name}`)
      }
    }

    console.log(`Successfully synced ${notionAgents.length} agents to Supabase`)
  } catch (error) {
    console.error('Error syncing agents to Supabase:', error)
  }
}

// Sync all data from Notion to Supabase
export async function syncAllFromNotionToSupabase(): Promise<void> {
  console.log('Starting sync from Notion to Supabase...')
  
  await syncBlogPostsToSupabase()
  await syncProjectsToSupabase()
  await syncAgentsToSupabase()
  
  console.log('Sync from Notion to Supabase completed')
}

// Sync blog posts from Supabase to Notion (basic implementation)
export async function syncBlogPostsToNotion(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_BLOG_DB_ID) {
    console.warn('Notion API key or blog database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all blog posts from Supabase
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts from Supabase:', error)
      return
    }

    if (!supabasePosts) {
      console.log('No blog posts found in Supabase')
      return
    }

    // For each Supabase post, check if it exists in Notion and create if not
    for (const post of supabasePosts) {
      try {
        // Check if post exists in Notion
        const response = await notion.databases.query({
          database_id: process.env.NOTION_BLOG_DB_ID,
          filter: {
            property: 'slug',
            rich_text: {
              equals: post.slug,
            },
          },
        })

        if (response.results.length === 0) {
          // Create new post in Notion
          await notion.pages.create({
            parent: { database_id: process.env.NOTION_BLOG_DB_ID },
            properties: {
              title: {
                title: [
                  {
                    text: {
                      content: post.title,
                    },
                  },
                ],
              },
              slug: {
                rich_text: [
                  {
                    text: {
                      content: post.slug,
                    },
                  },
                ],
              },
              published: {
                checkbox: post.published,
              },
              tags: {
                multi_select: post.tags?.map((tag: string) => ({ name: tag })) || [],
              },
              date: {
                date: {
                  start: post.published_at || post.created_at,
                },
              },
              excerpt: {
                rich_text: [
                  {
                    text: {
                      content: post.content?.substring(0, 200) || '',
                    },
                  },
                ],
              },
              author: {
                rich_text: [
                  {
                    text: {
                      content: post.author || 'Unknown',
                    },
                  },
                ],
              },
            },
          })

          console.log(`Created blog post in Notion: ${post.title}`)
        }
      } catch (error) {
        console.error(`Error syncing blog post ${post.slug} to Notion:`, error)
      }
    }

    console.log(`Successfully synced ${supabasePosts.length} blog posts to Notion`)
  } catch (error) {
    console.error('Error syncing blog posts to Notion:', error)
  }
}

// Sync projects from Supabase to Notion
export async function syncProjectsToNotion(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_PROJECT_DB_ID) {
    console.warn('Notion API key or project database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all projects from Supabase
    const { data: supabaseProjects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects from Supabase:', error)
      return
    }

    if (!supabaseProjects) {
      console.log('No projects found in Supabase')
      return
    }

    // For each Supabase project, check if it exists in Notion and create if not
    for (const project of supabaseProjects) {
      try {
        // Check if project exists in Notion
        const response = await notion.databases.query({
          database_id: process.env.NOTION_PROJECT_DB_ID,
          filter: {
            property: 'slug',
            rich_text: {
              equals: project.slug,
            },
          },
        })

        if (response.results.length === 0) {
          // Create new project in Notion
          await notion.pages.create({
            parent: { database_id: process.env.NOTION_PROJECT_DB_ID },
            properties: {
              title: {
                title: [
                  {
                    text: {
                      content: project.title,
                    },
                  },
                ],
              },
              slug: {
                rich_text: [
                  {
                    text: {
                      content: project.slug,
                    },
                  },
                ],
              },
              subtitle: {
                rich_text: [
                  {
                    text: {
                      content: project.subtitle || '',
                    },
                  },
                ],
              },
              description: {
                rich_text: [
                  {
                    text: {
                      content: project.description || '',
                    },
                  },
                ],
              },
              status: {
                select: {
                  name: project.status || 'idea',
                },
              },
              tags: {
                multi_select: project.tags?.map((tag: string) => ({ name: tag })) || [],
              },
              githubUrl: {
                url: project.github_url || '',
              },
              date: {
                date: {
                  start: project.created_at,
                },
              },
            },
          })

          console.log(`Created project in Notion: ${project.title}`)
        }
      } catch (error) {
        console.error(`Error syncing project ${project.slug} to Notion:`, error)
      }
    }

    console.log(`Successfully synced ${supabaseProjects.length} projects to Notion`)
  } catch (error) {
    console.error('Error syncing projects to Notion:', error)
  }
}

// Sync agents from Supabase to Notion
export async function syncAgentsToNotion(): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_AGENT_DB_ID) {
    console.warn('Notion API key or agent database ID not configured')
    return
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase not available for sync')
    return
  }

  try {
    // Fetch all agents from Supabase
    const { data: supabaseAgents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agents from Supabase:', error)
      return
    }

    if (!supabaseAgents) {
      console.log('No agents found in Supabase')
      return
    }

    // For each Supabase agent, check if it exists in Notion and create if not
    for (const agent of supabaseAgents) {
      try {
        // Check if agent exists in Notion
        const response = await notion.databases.query({
          database_id: process.env.NOTION_AGENT_DB_ID,
          filter: {
            property: 'slug',
            rich_text: {
              equals: agent.slug,
            },
          },
        })

        if (response.results.length === 0) {
          // Create new agent in Notion
          await notion.pages.create({
            parent: { database_id: process.env.NOTION_AGENT_DB_ID },
            properties: {
              name: {
                title: [
                  {
                    text: {
                      content: agent.name,
                    },
                  },
                ],
              },
              slug: {
                rich_text: [
                  {
                    text: {
                      content: agent.slug,
                    },
                  },
                ],
              },
              status: {
                select: {
                  name: agent.status || 'idea',
                },
              },
              category: {
                rich_text: [
                  {
                    text: {
                      content: agent.category || '',
                    },
                  },
                ],
              },
              description: {
                rich_text: [
                  {
                    text: {
                      content: agent.description || '',
                    },
                  },
                ],
              },
              inputs: {
                rich_text: [
                  {
                    text: {
                      content: agent.inputs?.join(', ') || '',
                    },
                  },
                ],
              },
              tags: {
                multi_select: agent.tags?.map((tag: string) => ({ name: tag })) || [],
              },
              exampleUses: {
                rich_text: [
                  {
                    text: {
                      content: agent.example_uses?.join(', ') || '',
                    },
                  },
                ],
              },
              triggerType: {
                rich_text: [
                  {
                    text: {
                      content: agent.trigger_type || '',
                    },
                  },
                ],
              },
              date: {
                date: {
                  start: agent.created_at,
                },
              },
            },
          })

          console.log(`Created agent in Notion: ${agent.name}`)
        }
      } catch (error) {
        console.error(`Error syncing agent ${agent.slug} to Notion:`, error)
      }
    }

    console.log(`Successfully synced ${supabaseAgents.length} agents to Notion`)
  } catch (error) {
    console.error('Error syncing agents to Notion:', error)
  }
}

// Sync all data from Supabase to Notion
export async function syncAllFromSupabaseToNotion(): Promise<void> {
  console.log('Starting sync from Supabase to Notion...')
  
  await syncBlogPostsToNotion()
  await syncProjectsToNotion()
  await syncAgentsToNotion()
  
  console.log('Sync from Supabase to Notion completed')
}

// Two-way sync function
export async function performTwoWaySync(): Promise<void> {
  console.log('Starting two-way sync between Notion and Supabase...')
  
  // Sync from Notion to Supabase
  await syncAllFromNotionToSupabase()
  
  // Sync from Supabase to Notion
  await syncAllFromSupabaseToNotion()
  
  console.log('Two-way sync completed')
} 