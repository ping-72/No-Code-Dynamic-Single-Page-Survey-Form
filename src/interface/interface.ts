export interface DependencyCondition {
  questionId: string;
  expectedAnswer: string;
  sectionId?: string;
  questionText?: string; // Added to show question text in selector
  dependencyType: "visibility" | "options";
  targetOptions?: string[]; // Change from string to string[]
}

export interface Option {
  optionId: string;
  questionId: string;
  value: string;
  dependentOn?: DependencyCondition[];
}

export interface Question {
  questionId: string;
  sectionId: string;
  questionText: string;
  type:
    | "single-select"
    | "multi-select"
    | "integer"
    | "number"
    | "text"
    | "linear-scale";
  isRequired: boolean;
  dependencies?: DependencyCondition[];
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
  question: Question[];
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
