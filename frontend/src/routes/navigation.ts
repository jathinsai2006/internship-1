import {
  LayoutGrid,
  UploadCloud,
  MessageSquare,
  ScrollText,
  Search,
  History,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  { label: 'Workspace', to: '/', icon: LayoutGrid, description: 'Your document workspace' },
  { label: 'Upload Documents', to: '/upload', icon: UploadCloud, description: 'Upload PDFs for RAG processing' },
  { label: 'AI Chat', to: '/chat', icon: MessageSquare, description: 'Chat with your documents' },
  { label: 'AI Summaries', to: '/summaries', icon: ScrollText, description: 'Generate AI summaries' },
  { label: 'Semantic Search', to: '/search', icon: Search, description: 'Vector search across documents' },
  { label: 'Recent History', to: '/history', icon: History, description: 'Your activity log' },
  { label: 'Settings', to: '/settings', icon: Settings, description: 'Application information' },
];
