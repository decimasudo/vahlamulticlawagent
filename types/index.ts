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
}

export interface AgentConfig {
  agent_name: string;
  generated_at: string;
  security_level: string;
  vahla_core_version: string; // Branding: Kita sebut versi core kita
  skills: {
    name: string;
    source: string;
    type?: "user-selected" | "security-mandatory" | "security-optional";
  }[];
}