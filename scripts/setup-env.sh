#!/bin/bash

# My Vision Hub v2.0 - Environment Setup Script
# This script helps you set up the required environment variables for Notion integration

echo "🚀 My Vision Hub v2.0 - Environment Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "📁 Found existing .env.local file"
    echo "   Backing up to .env.local.backup"
    cp .env.local .env.local.backup
else
    echo "📁 Creating new .env.local file"
fi

echo ""
echo "🔑 Notion Integration Setup"
echo "=========================="
echo ""

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        echo "${input:-$default}"
    else
        read -p "$prompt: " input
        echo "$input"
    fi
}

# Function to check if value looks like a valid Notion ID
is_valid_notion_id() {
    local id="$1"
    # Notion IDs are typically 32 characters long, containing letters, numbers, and hyphens
    if [[ $id =~ ^[a-zA-Z0-9-]{32}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate and prompt for Notion ID
prompt_notion_id() {
    local prompt="$1"
    local var_name="$2"
    local current_value="$3"
    
    while true; do
        id=$(prompt_with_default "$prompt" "$current_value")
        
        if [ -z "$id" ]; then
            echo "   ⚠️  This field is required. Please enter a value."
            continue
        fi
        
        if is_valid_notion_id "$id"; then
            echo "   ✅ Valid Notion ID format"
            break
        else
            echo "   ⚠️  This doesn't look like a valid Notion ID (should be 32 characters, letters/numbers/hyphens)"
            echo "   💡 You can find this in your Notion database URL"
            echo "   💡 Example: https://notion.so/workspace-name/DATABASE_ID_HERE?v=..."
            read -p "   Continue anyway? (y/N): " continue_anyway
            if [[ $continue_anyway =~ ^[Yy]$ ]]; then
                break
            fi
        fi
    done
    
    echo "$id"
}

echo "📝 Please provide the following information for your Notion integration:"
echo ""

# Get current values from .env.local if it exists
if [ -f ".env.local" ]; then
    source .env.local
fi

# Prompt for Notion API Key
echo "🔑 Notion API Key (Integration Token)"
echo "   Get this from: https://notion.so/my-integrations"
echo "   It should start with 'secret_'"
api_key=$(prompt_with_default "Enter your Notion API key" "$NOTION_API_KEY")
echo ""

# Prompt for database IDs
echo "🗄️  Notion Database IDs"
echo "   You can find these in your Notion database URLs"
echo ""

milestones_id=$(prompt_notion_id "Enter Milestones database ID" "NOTION_MILESTONES_DB_ID" "$NOTION_MILESTONES_DB_ID")
echo ""

projects_id=$(prompt_notion_id "Enter Projects database ID" "NOTION_PROJECT_DB_ID" "$NOTION_PROJECT_DB_ID")
echo ""

blog_id=$(prompt_notion_id "Enter Blog Posts database ID" "NOTION_BLOG_DB_ID" "$NOTION_BLOG_DB_ID")
echo ""

agents_id=$(prompt_notion_id "Enter Agents database ID" "NOTION_AGENTS_DB_ID" "$NOTION_AGENTS_DB_ID")
echo ""

# Create or update .env.local
echo "📝 Writing environment variables to .env.local..."
cat > .env.local << EOF
# My Vision Hub v2.0 - Environment Variables
# Generated on $(date)

# Notion Integration
NOTION_API_KEY=$api_key
NOTION_MILESTONES_DB_ID=$milestones_id
NOTION_PROJECT_DB_ID=$projects_id
NOTION_BLOG_DB_ID=$blog_id
NOTION_AGENTS_DB_ID=$agents_id

# Add your other environment variables below
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
# GITHUB_TOKEN=your_github_token
EOF

echo "✅ Environment variables written to .env.local"
echo ""

# Validate configuration
echo "🔍 Validating configuration..."
echo ""

# Check if all required variables are set
missing_vars=()
[ -z "$api_key" ] && missing_vars+=("NOTION_API_KEY")
[ -z "$milestones_id" ] && missing_vars+=("NOTION_MILESTONES_DB_ID")
[ -z "$projects_id" ] && missing_vars+=("NOTION_PROJECT_DB_ID")
[ -z "$blog_id" ] && missing_vars+=("NOTION_BLOG_DB_ID")
[ -z "$agents_id" ] && missing_vars+=("NOTION_AGENTS_DB_ID")

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required Notion environment variables are configured!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Restart your development server: npm run dev"
    echo "   2. Visit /api/notion-status to verify configuration"
    echo "   3. Visit /timeline to see your Notion data"
    echo ""
    echo "📚 For detailed setup instructions, see: docs/setup/notion-integration-setup.md"
else
    echo "⚠️  Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please run this script again and provide all required values."
fi

echo ""
echo "🔒 Security Note: .env.local contains sensitive information and should never be committed to version control."
echo "   It's already added to .gitignore for your safety."
echo ""
echo "📁 Your .env.local file has been created/updated."
if [ -f ".env.local.backup" ]; then
    echo "📁 A backup of your previous configuration was saved as .env.local.backup"
fi
