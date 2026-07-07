export interface Memory {
  id: string;
  title: string;
  date?: string;
  description: string;
  imageUrl: string;
}

export interface AppConfig {
  partnerName: string;
  senderName: string;
  proposalQuestion: string;
  proposalMessage: string;
  anniversaryDate: string;
  memories: Memory[];
  reasons: string[];
}
