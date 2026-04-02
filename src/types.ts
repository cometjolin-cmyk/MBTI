export type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface Question {
  id: number;
  part: 1 | 2 | 3;
  text: string;
  enText?: string;
  agreeIndicator: number;
  disagreeIndicator: number;
}

export interface PersonalityType {
  code: string;
  title: string;
  enTitle?: string;
  description: string;
  enDescription?: string;
  traits: string[];
  enTraits?: string[];
  careers: string[];
  enCareers?: string[];
  analysis: string;
  enAnalysis?: string;
  imagePrompt: string;
  family: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';
}

export interface QuizState {
  answers: Record<number, number>; // -3 to 3
  currentStep: number;
}
