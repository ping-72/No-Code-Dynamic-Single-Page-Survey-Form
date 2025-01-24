export interface DependencyCondition {
  sectionId?: string;
  questionId: string;
  expectedAnswer: string;
  questionText?: string; // Added to show question text in selector
  dependencyType: "visibility" | "options";
  targetOptions?: string[]; // Change from string to string[]
}
export type QuestionType =
  | "single-select"
  | "multi-select"
  | "integer"
  | "number"
  | "text"
  | "linear-scale";
export interface Option {
  optionId: string;
  questionId: string;
  value: string;
  dependencies?: DependencyCondition[];
}

export interface Question {
  questionId: string;
  sectionId: string;
  questionText: string;
  type: QuestionType;
  isRequired: boolean;
  dependencies?: DependencyCondition[];
  dependentOn?: DependencyCondition[];
  order: number;
  createdAt: string;
  options: Option[];
  scaleRange?: 5 | 10;
  scaleLabels?: {
    start: string;
    end: string;
  };
}

export interface Section {
  SectionId: string;
  formId: string;
  sectionTitle: string;
  description?: string;
  questions: Question[];
  order: number;
  createdAt: string;
}

export interface Form {
  formId: string;
  formTitle: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}
