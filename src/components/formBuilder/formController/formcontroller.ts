import {
  Form,
  Section,
  DependencyCondition,
  Question,
  Option,
} from "./../../../interface/interface";
import { v4 as uuidv4 } from "uuid";

export class FormController {
  static addSection(form: Form): Form {
    const newSection: Section = {
      SectionId: uuidv4(),
      formId: form.formId,
      sectionTitle: "New Section",
      description: "",
      question: [],
      order: form.sections.length,
      createdAt: new Date().toISOString(),
    };

    return {
      ...form,
      sections: [...form.sections, newSection],
      updatedAt: new Date().toISOString(),
    };
  }

  static deleteSection(form: Form, sectionId: string): Form {
    return {
      ...form,
      sections: form.sections.filter((sec) => sec.SectionId !== sectionId),
      updatedAt: new Date().toISOString(),
    };
  }

  static updateSectionTitle(
    form: Form,
    sectionId: string,
    title: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId ? { ...sec, sectionTitle: title } : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static addQuestion(
    form: Form,
    sectionId: string,
    dependency?: DependencyCondition[]
  ): Form {
    const newQuestion: Question = {
      questionId: uuidv4(),
      sectionId,
      questionText: dependency
        ? `[Dependent] New question based on ${dependency[0]?.questionText}`
        : "New Question",
      type: "single-select",
      isRequired: true,
      dependencies: dependency || [],
      order:
        form.sections.find((s) => s.SectionId === sectionId)?.question.length ||
        0,
      createdAt: new Date().toISOString(),
      options: [],
    };

    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: [...sec.question, newQuestion],
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static updateQuestion(
    form: Form,
    sectionId: string,
    questionId: string,
    questionText: string,
    dependency?: DependencyCondition[]
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      questionText,
                      dependencies: dependency
                        ? [...(q.dependencies || []), ...dependency]
                        : q.dependencies,
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static deleteQuestion(
    form: Form,
    sectionId: string,
    questionId: string
  ): Form {
    // First, remove any dependencies that reference this question
    const cleanedForm = {
      ...form,
      sections: form.sections.map((sec) => ({
        ...sec,
        question: sec.question.map((q) => ({
          ...q,
          dependencies:
            q.dependencies?.filter((d) => d.questionId !== questionId) || [],
          options: q.options.map((opt) => ({
            ...opt,
            dependentOn:
              opt.dependentOn?.filter((d) => d.questionId !== questionId) || [],
          })),
        })),
      })),
    };

    // Then remove the question itself
    return {
      ...cleanedForm,
      sections: cleanedForm.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.filter((q) => q.questionId !== questionId),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static addOption(form: Form, sectionId: string, questionId: string): Form {
    const newOption: Option = {
      optionId: uuidv4(),
      questionId,
      value: "New Option",
    };
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? { ...q, options: [...q.options, newOption] }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static updateOptionValue(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string,
    value: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt) =>
                        opt.optionId === optionId
                          ? { ...opt, value: value }
                          : opt
                      ),
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static deleteOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      options: q.options.filter(
                        (opt) => opt.optionId !== optionId
                      ),
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static updateAnswerType(
    form: Form,
    sectionId: string,
    questionId: string,
    type: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId ? { ...q, answerType: type } : q
              ),
            }
          : sec
      ),
    };
  }

  static updateQuestionType(
    form: Form,
    sectionId: string,
    questionId: string,
    type: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      type: type,
                      scaleRange: type === "linear-scale" ? 5 : undefined,
                      options:
                        type === "linear-scale"
                          ? Array.from({ length: 5 }, (_, i) => ({
                              optionId: uuidv4(),
                              questionId: q.questionId,
                              value: `${i + 1}`,
                            }))
                          : ["text", "number", "integer"].includes(type)
                          ? []
                          : q.options,
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static addDependencyToOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string,
    dependency: DependencyCondition
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId === sectionId) {
          return {
            ...sec,
            question: sec.question.map((q) => {
              if (q.questionId === questionId) {
                return {
                  ...q,
                  options: q.options.map((opt) => {
                    if (opt.optionId === optionId) {
                      const existingDeps = opt.dependentOn || [];
                      return {
                        ...opt,
                        dependentOn: [...existingDeps, dependency],
                      };
                    }
                    return opt;
                  }),
                };
              }
              return q;
            }),
          };
        }
        return sec;
      }),
      updatedAt: new Date().toString(),
    };
  }

  static addDependency(
    form: Form,
    sectionId: string,
    questionId: string,
    dependency: DependencyCondition
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      dependencies: [...(q.dependencies || []), dependency],
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static removeDependency(
    form: Form,
    sectionId: string,
    questionId: string,
    dependencyIndex: number
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      dependencies: (q.dependencies || []).filter(
                        (_, index) => index !== dependencyIndex
                      ),
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  private static getLikertLabels(range: 5 | 10): string[] {
    if (range === 5) {
      return [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ];
    }
    return [
      "Strongly Disagree",
      "Mostly Disagree",
      "Disagree",
      "Somewhat Disagree",
      "Neutral",
      "Somewhat Agree",
      "Agree",
      "Mostly Agree",
      "Strongly Agree",
      "Completely Agree",
    ];
  }

  static updateScaleRange(
    form: Form,
    sectionId: string,
    questionId: string,
    range: 5 | 10
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              question: sec.question.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      scaleRange: range,
                      likertLabels: this.getLikertLabels(range),
                      options: Array.from({ length: range }, (_, i) => ({
                        optionId: uuidv4(),
                        questionId: q.questionId,
                        value: `${i + 1}`,
                      })),
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static shouldDisplayOption(
    option: Option,
    responses: Record<string, string>,
    dependencies?: DependencyCondition[]
  ): boolean {
    if (!dependencies || dependencies.length === 0) return true;

    return dependencies.some((dep) => {
      const matchesCondition = responses[dep.questionId] === dep.expectedAnswer;
      if (dep.dependencyType === "options" && dep.targetOptions) {
        return matchesCondition && dep.targetOptions.includes(option.value);
      }
      return matchesCondition;
    });
  }

  static shouldDisplayQuestion(
    dependencies: DependencyCondition[] | undefined,
    responses: Record<string, string>
  ): boolean {
    if (!dependencies || dependencies.length === 0) return true;

    return dependencies
      .filter((dep) => dep.dependencyType === "visibility")
      .every((dep) => responses[dep.questionId] === dep.expectedAnswer);
  }

  static createDependentQuestion(
    form: Form,
    sectionId: string,
    dependency: DependencyCondition,
    questionType: string
  ): Form {
    const dependentSection = form.sections.find((sec) =>
      sec.question.some((q) => q.questionId === dependency.questionId)
    );

    const dependentQuestion = dependentSection?.question.find(
      (q) => q.questionId === dependency.questionId
    );

    const newQuestion: Question = {
      questionId: uuidv4(),
      sectionId,
      questionText: `[Dependent Question] ${
        dependentQuestion?.questionText || "New Question"
      }`,
      type: questionType,
      isRequired: true,
      dependencies: [dependency],
      order: 0,
      createdAt: new Date().toISOString(),
      options:
        questionType === "single-select" || questionType === "multi-select"
          ? [{ optionId: uuidv4(), questionId: "", value: "Option 1" }]
          : [],
    };

    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? { ...sec, question: [...sec.question, newQuestion] }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }
}
