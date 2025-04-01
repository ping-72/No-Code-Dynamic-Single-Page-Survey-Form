import {
  Form,
  Section,
  DependencyCondition,
  Question,
  Option,
  QuestionType,
  OptionType,
} from "./../../../interface/interface";
import { v4 as uuidv4 } from "uuid";

export class FormController {
  // private static getLikertLabels(range: 5 | 10): string[] {
  //   if (range === 5) {
  //     return [
  //       "Strongly Disagree",
  //       "Disagree",
  //       "Neutral",
  //       "Agree",
  //       "Strongly Agree",
  //     ];
  //   }
  //   return [
  //     "Strongly Disagree",
  //     "Mostly Disagree",
  //     "Disagree",
  //     "Somewhat Disagree",
  //     "Neutral",
  //     "Somewhat Agree",
  //     "Agree",
  //     "Mostly Agree",
  //     "Strongly Agree",
  //     "Completely Agree",
  //   ];
  // }

  // Finds a section by ID
  private static findSection(
    form: Form,
    sectionId: string
  ): Section | undefined {
    return form.sections.find((sec) => sec.SectionId === sectionId);
  }

  // Finds a question by ID within a given section
  private static findQuestion(
    section: Section,
    questionId: string
  ): Question | undefined {
    return section.questions.find((q) => q.questionId === questionId);
  }

  // Finds an option by ID within a given question
  private static findOption(
    question: Question,
    optionId: string
  ): Option | undefined {
    return question.options.find((opt) => opt.optionId === optionId);
  }

  // Adds a new section to the form
  static addSection(form: Form): Form {
    const newSection: Section = {
      SectionId: uuidv4(),
      formId: form.formId,
      sectionTitle: "New Section",
      description: "",
      questions: [],
      order: form.sections.length + 1,
      createdAt: new Date().toISOString(),
      type: "regular",
    };

    return {
      ...form,
      sections: [...form.sections, newSection],
      updatedAt: new Date().toISOString(),
    };
  }

  // Deletes a section from the form by sectionId
  static deleteSection(form: Form, sectionId: string): Form {
    return {
      ...form,
      sections: form.sections.filter((sec) => sec.SectionId !== sectionId),
      updatedAt: new Date().toISOString(),
    };
  }

  // Updates the title of a section by sectionId
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

  // Adds a new question to a section by sectionId
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
      dependentOn: dependency || [],
      order:
        form.sections.find((s) => s.SectionId === sectionId)?.questions
          .length || 0,
      createdAt: new Date().toISOString(),
      options: [],
    };

    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: [...sec.questions, newQuestion],
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  // Updates a question's text and dependencies by questionId
  static updateQuestion(
    form: Form,
    sectionId: string,
    questionId: string,
    questionText: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      questionText,
                    }
                  : q
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  // Deletes a question from a section by questionId
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
        questions: sec.questions.map((q) => ({
          ...q,
          dependencies:
            q.dependencies?.filter((d) => d.questionId !== questionId) || [],
          options: q.options.map((opt) => ({
            ...opt,
            dependentOn:
              opt.dependencies?.filter((d) => d.questionId !== questionId) ||
              [],
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
              question: sec.questions.filter(
                (q) => q.questionId !== questionId
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  // Adds a new option to a question by questionId
  static addOption(form: Form, sectionId: string, questionId: string): Form {
    const newOption: Option = {
      optionId: uuidv4(),
      questionId,
      value: "New Option",
      type: "normal",
    };
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
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

  // Updates the value of an option by optionId
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
              questions: sec.questions.map((q) =>
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

  // Deletes an option from a question by optionId
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
              questions: sec.questions.map((q) =>
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

  // Updates the answer type of a question by questionId
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
              questions: sec.questions.map((q) =>
                q.questionId === questionId ? { ...q, answerType: type } : q
              ),
            }
          : sec
      ),
    };
  }

  // Updates the question type of a question by questionId
  static updateQuestionType(
    form: Form,
    sectionId: string,
    questionId: string,
    type: QuestionType
  ): Form {
    // First, find all questions that depend on this question
    const dependentQuestions: { sectionId: string; questionId: string }[] = [];
    form.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (
          question.dependencies?.some((dep) => dep.questionId === questionId)
        ) {
          dependentQuestions.push({
            sectionId: section.SectionId,
            questionId: question.questionId,
          });
        }
      });
    });

    // Clear dependencies if new type is multi-select or text
    const shouldClearDependencies = ["multi-select", "text"].includes(type);

    // First update the question type
    let updatedForm = {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      type,
                      // Clear dependencies if type is multi-select or text
                      dependencies: shouldClearDependencies
                        ? []
                        : q.dependencies,
                      scaleRange:
                        type === "linear-scale" ? (5 as const) : undefined,
                      options:
                        type === "linear-scale"
                          ? Array.from({ length: 5 }, (_, i) => ({
                              optionId: uuidv4(),
                              questionId: q.questionId,
                              value: `${i + 1}`,
                              type: "normal" as OptionType,
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

    // If dependencies should be cleared, remove all dependent questions
    if (shouldClearDependencies && dependentQuestions.length > 0) {
      dependentQuestions.forEach(({ sectionId, questionId }) => {
        updatedForm = {
          ...updatedForm,
          sections: updatedForm.sections.map((sec) =>
            sec.SectionId === sectionId
              ? {
                  ...sec,
                  questions: sec.questions.filter(
                    (q) => q.questionId !== questionId
                  ),
                }
              : sec
          ),
        };
      });
    }

    return updatedForm;
  }

  // Adds a dependency to an option by optionId
  static addDependencyToOption(
    form: Form,
    selfSectionId: string,
    selfQuestionId: string,
    selfOptionId: string,
    dependentSectionId: string,
    dependency: DependencyCondition,
    _dependencyType: string,
    _targetOptions: string[]
  ): Form {
    const selfSection = FormController.findSection(form, selfSectionId);
    const dependentSection = FormController.findSection(
      form,
      dependentSectionId
    );

    if (!selfSection || !dependentSection) return form;
    if (dependentSection.order >= selfSection.order) return form;

    const selfQuestion = FormController.findQuestion(
      selfSection,
      selfQuestionId
    );
    if (!selfQuestion) return form;

    const selfOption = FormController.findOption(selfQuestion, selfOptionId);
    if (!selfOption) return form;

    return {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId === selfSectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.questionId === selfQuestionId) {
                return {
                  ...q,
                  options: q.options.map((opt) => {
                    if (opt.optionId === selfOptionId) {
                      const existingDeps = opt.dependencies || [];
                      return {
                        ...opt,
                        dependencies: [...existingDeps, dependency],
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
      updatedAt: new Date().toISOString(),
    };
  }

  // Adds a dependency to a question by questionId
  static addDependency(
    form: Form,
    sectionId: string,
    questionId: string,
    dependency: DependencyCondition
  ): Form {
    const currentSection = FormController.findSection(form, sectionId);
    const dependentSection = form.sections.find((sec) =>
      sec.questions.some((q) => q.questionId === dependency.questionId)
    );

    // Validate existence and order of sections
    if (!currentSection || !dependentSection) return form;
    if (dependentSection.order >= currentSection.order) return form;

    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q.questionId === questionId
                  ? {
                      ...q,
                      dependencies: Array.from(
                        new Set([...(q.dependencies || []), dependency])
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

  // Removes a dependency from a question by dependencyIndex
  static removeDependency(
    form: Form,
    sectionId: string,
    questionId: string,
    dependencyIndex: number
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.questionId === questionId) {
                return {
                  ...q,
                  dependencies: (q.dependencies || []).filter(
                    (_, index) => index !== dependencyIndex
                  ),
                };
              }
              return q;
            }),
          };
        }
        return sec;
      }),
      updatedAt: new Date().toISOString(),
    };
  }

  static createDependentQuestion(
    form: Form,
    targetSectionId: string,
    parentSectionId: string,
    parentQuestionId: string,
    expectedAnswer: string,
    _parentOptionId: string | undefined,
    dependencyType: "visibility" | "options",
    questionType: string,
    triggerOptionId?: string
  ): Form {
    // Validate target and parent sections
    const targetSection = FormController.findSection(form, targetSectionId);
    const parentSection = FormController.findSection(form, parentSectionId);
    if (!targetSection || !parentSection) return form;

    // Ensure parent's order precedes target's order
    if (parentSection.order >= targetSection.order) return form;

    // Find the parent question
    const parentQuestion = FormController.findQuestion(
      parentSection,
      parentQuestionId
    );
    if (!parentQuestion) return form;

    // Build a dependency condition using parent information
    const dependency: DependencyCondition = {
      sectionId: parentSectionId,
      questionId: parentQuestionId,
      expectedAnswer, // Placeholder; set as needed
      questionText: parentQuestion.questionText,
      dependencyType,
      targetOptions: [],
    };

    // Update dependency on the parent question
    let updatedForm = FormController.addDependency(
      form,
      parentSectionId,
      parentQuestionId,
      dependency
    );

    // If parent question is single-select, update option dependency as well
    if (parentQuestion.type === "single-select" && triggerOptionId) {
      updatedForm = FormController.addDependencyToOption(
        updatedForm,
        parentSectionId,
        parentQuestionId,
        triggerOptionId,
        parentSectionId, // Using parentSectionId as dependentSectionId placeholder
        dependency,
        dependencyType,
        dependency.targetOptions || []
      );
    }

    // Create the new dependent question in the target section
    const newQuestion: Question = {
      questionId: uuidv4(),
      sectionId: targetSectionId,
      questionText: `[Dependent Question] ${
        parentQuestion.questionText || "New Question"
      }`,
      type: "single-select",
      isRequired: true,
      dependencies: [dependency],
      order: targetSection.questions.length,
      createdAt: new Date().toISOString(),
      options:
        questionType === "single-select" || questionType === "multi-select"
          ? [
              {
                optionId: uuidv4(),
                questionId: "",
                value: "Option 1",
                type: "normal",
              },
            ]
          : [],
    };

    // Add the new question to the target section
    updatedForm = {
      ...updatedForm,
      sections: updatedForm.sections.map((sec) =>
        sec.SectionId === targetSectionId
          ? { ...sec, questions: [...sec.questions, newQuestion] }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  // Determines if an option should be displayed based on dependencies and responses
  static shouldDisplayOption(
    option: Option,
    responses: Record<string, string>,
    dependencies?: DependencyCondition[]
  ): boolean {
    if (!dependencies || dependencies.length === 0) return true;

    return dependencies.some((dep) => {
      const matchesCondition = responses[dep.questionId] === dep.expectedAnswer;
      if (dep.dependencyType === "options" && dep.targetOptions) {
        return (
          matchesCondition &&
          typeof option.value === "string" &&
          dep.targetOptions.includes(option.value)
        );
      }
      return matchesCondition;
    });
  }

  // Determines if a question should be displayed based on dependencies and responses
  static shouldDisplayQuestion(
    dependencies: DependencyCondition[] | undefined,
    responses: Record<string, string>
  ): boolean {
    if (!dependencies || dependencies.length === 0) return true;

    return dependencies
      .filter((dep) => dep.dependencyType === "visibility")
      .every((dep) => responses[dep.questionId] === dep.expectedAnswer);
  }

  // Creates a dependent question based on a dependency condition
}
