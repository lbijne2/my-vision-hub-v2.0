import { Github, Users, UserPlus, MapPin, Building, Globe, Twitter, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GitHubUserData } from "@/lib/github"

interface GitHubUserCardProps {
  userData: GitHubUserData
  className?: string
}

export function GitHubUserCard({ userData, className }: GitHubUserCardProps) {
  // Sort popular languages by count
  const sortedLanguages = Object.entries(userData.popularLanguages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <Card className={cn(
      "bg-pastel-sky/20 border-vision-border shadow-sm transition-all duration-200 hover:shadow-lg group",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={userData.avatar_url} 
              alt={`${userData.login} avatar`}
              className="h-12 w-12 rounded-full border-2 border-vision-border"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base text-vision-ochre group-hover:text-vision-ochre/80 transition-colors">
              <a 
                href={userData.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {userData.name || userData.login}
              </a>
            </CardTitle>
            <CardDescription className="text-vision-charcoal/70 text-sm">
              @{userData.login}
            </CardDescription>
          </div>
        </div>
        {userData.bio && (
          <CardDescription className="text-vision-charcoal/70 text-sm leading-relaxed mt-2">
            {userData.bio}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-yellow-500">
            <a
              href={`${userData.html_url}?tab=followers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <Users className="h-4 w-4 text-yellow-500" />
              <span>{userData.followers.toLocaleString()}</span>
            </a>
            <a
              href={`${userData.html_url}?tab=following`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <UserPlus className="h-4 w-4 text-vision-ochre" />
              <span>{userData.following.toLocaleString()}</span>
            </a>
            <a
              href={`${userData.html_url}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <Github className="h-4 w-4 text-vision-ochre" />
              <span>{userData.public_repos}</span>
            </a>
          </div>

          {/* Location and Company - Commented out for now */}
          {/* <div className="flex flex-wrap gap-4 text-sm text-vision-charcoal/60">
            {userData.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.company && (
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{userData.company}</span>
              </div>
            )}
            {userData.blog && (
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <a 
                  href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-vision-ochre hover:underline"
                >
                  {userData.blog}
                </a>
              </div>
            )}
            {userData.twitter_username && (
              <div className="flex items-center space-x-1">
                <Twitter className="h-4 w-4" />
                <a 
                  href={`https://twitter.com/${userData.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-vision-ochre hover:underline"
                >
                  @{userData.twitter_username}
                </a>
              </div>
            )}
          </div> */}

          {/* Member since */}
          <div className="flex items-center space-x-1 text-sm text-vision-charcoal/60">
            <Calendar className="h-4 w-4" />
            <span>Member since {new Date(userData.created_at).toLocaleDateString()}</span>
          </div>

          {/* Popular Languages - without counts */}
          {sortedLanguages.length > 0 && (
            <div>
              <div className="text-sm font-medium text-vision-charcoal/80 mb-2">Popular Languages</div>
              <div className="flex flex-wrap gap-1">
                {sortedLanguages.map(([language]) => (
                  <Badge 
                    key={language} 
                    variant="outline" 
                    className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
