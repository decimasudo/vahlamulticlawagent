// types/index.ts

// types/index.ts
export interface Skill {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  github_url: string;
  install_command: string;
  // Field baru untuk Test Drive yang lebih cerdas
  suggested_commands?: string[]; 
}
// EOF

export interface CommunityAgent {
  id: string;
  name: string;
  description: string;
  creator: string;
  skills: string[]; // Array of skill names or IDs
  created_at: string;
}

export interface AgentConfig {
  agent_name: string;
  generated_at: string;
  security_level: string;
  vahla_core_version: string;
  skills: {
    name: string;
    source: string;
    type?: "user-selected" | "security-mandatory" | "security-optional";
  }[];
}
// EOF