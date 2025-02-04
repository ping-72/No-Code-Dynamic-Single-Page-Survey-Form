export type OptionType = "normal" | "table";

export type QuestionType =
  | "single-select"
  | "multi-select"
  | "integer"
  | "number"
  | "text"
  | "linear-scale"
  | "table";

export interface DependencyCondition {
  sectionId?: string;
  questionId: string;
  expectedAnswer?: string;
  questionText?: string; // Added to show question text in selector
  dependencyType: "visibility" | "options";
  triggerOptionId?: string;
  range?: Range[];
  targetOptions?: string[];
}

export interface Option {
  optionId: string;
  questionId: string;
  type: OptionType;
  value?: string;
  tableData?: TableData;
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

export interface Range {
  minValue?: number;
  maxValue?: number;
}

// Table implementation
export interface TableOption {
  optionId: string;
  questionId: string;
  type: "table";
  tableData: {
    rows: Attribute[];
    columns: string[];
  };
  dependencies?: DependencyCondition[];
}

export interface Attribute {
  attributeId: string;
  attributeName: string;
  value: Record<string, string | number | FunctionDependency>;
}
export interface FunctionDependency {
  type: "function";
  expression: string;
  dependencies?: string[]; // JavaScript expression that is to be converted to ans through mathjs
}

export interface TableData {
  rows: Attribute[];
  columns: string[];
}
