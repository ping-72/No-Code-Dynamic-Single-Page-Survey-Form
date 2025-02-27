import {
  Form,
  DependencyCondition,
  Question,
  QuestionType,
} from "../../../interface/interface";
import { v4 as uuidv4 } from "uuid";

export class QuestionController {
  static addQuestion(form: Form, sectionId: string): Form {
    const newQuestion: Question = {
      questionId: uuidv4(),
      sectionId,
      questionText: "New Question",
      type: "single-select",
      isRequired: true,
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

  static addDependentQuestion(
    form: Form,
    sectionId: string,
    dependencies: DependencyCondition[]
  ): Form {
    if (!dependencies || dependencies.length === 0) {
      throw new Error("No dependencies provided.");
    }
    const dependency = dependencies[0];

    const targetSection = form.sections.find(
      (sec) => sec.SectionId === sectionId
    );
    if (!targetSection) {
      throw new Error(`Target section with ID ${sectionId} not found.`);
    }

    // Retrieve parent question details for the new question's text
    const parentSection = form.sections.find(
      (sec) => sec.SectionId === dependency.sectionId
    );
    if (!parentSection) {
      throw new Error(
        `Parent section with ID ${dependency.sectionId} not found.`
      );
    }

    const parentQuestion = parentSection.questions.find(
      (q) => q.questionId === dependency.questionId
    );
    if (!parentQuestion) {
      throw new Error(
        `Parent question with ID ${dependency.questionId} not found in section ${dependency.sectionId}.`
      );
    }

    let parentOption = undefined;
    if (dependency.triggerOptionId) {
      parentOption = parentQuestion.options.find(
        (op) => op.optionId === dependency.triggerOptionId
      );
      if (!parentOption) {
        throw new Error(
          `Parent option with ID ${dependency.triggerOptionId} not found in question ${dependency.questionId}.`
        );
      }
    }

    const newQuestion: Question = {
      questionId: uuidv4(),
      sectionId,
      questionText: dependency
        ? `[Dependent] New question based on ${
            form.sections
              .find((s) => s.SectionId === dependency?.sectionId)
              ?.questions.find((q) => q.questionId === dependency?.questionId)
              ?.questionText
          }`
        : "New Question",
      type: "single-select",
      isRequired: true,
      order:
        form.sections.find((s) => s.SectionId === sectionId)?.questions
          .length || 0,
      createdAt: new Date().toISOString(),
      options: [],
      dependentOn: [dependency],
    };

    const updatedParentQuestion: Question = {
      ...parentQuestion,
      dependencies: parentQuestion.dependencies
        ? [...parentQuestion.dependencies, dependency]
        : [dependency],
    };
    let updatedParentOption = parentOption;
    if (parentOption) {
      updatedParentOption = {
        ...parentOption,
        dependencies: parentOption.dependencies
          ? [...parentOption.dependencies, dependency]
          : [dependency],
      };
    }

    // add the dependency to the newly created dependent question
    // const section = form.sections.find((sec) => sec.SectionId === sectionId);
    // if (section) {
    //   const question = section.questions.find((q) => q.questionId === questionId);
    //   if (question) {
    //     if (question.dependencies) {
    //       question.dependencies.push(
    //         {
    //           questionId: newQuestion.questionId,
    //           sectionId: newQuestion.sectionId,
    //         },
    //       );
    //     }
    //   }
    // });

    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId === sectionId) {
          return {
            ...sec,
            questions: [...sec.questions, newQuestion],
          };
        }
        if (sec.SectionId === dependency.sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.questionId === dependency.questionId) {
                return updatedParentQuestion;
              }
              return q;
            }),
          };
        }
        return sec;
      }),
      updatedAt: new Date().toISOString(),
    };
    if (parentOption && updatedParentOption) {
      updatedForm.sections = updatedForm.sections.map((sec) => {
        if (sec.SectionId === dependency.sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.questionId === dependency.questionId) {
                return {
                  ...q,
                  options: q.options.map((op) => {
                    if (op.optionId === dependency.triggerOptionId) {
                      return updatedParentOption!;
                    }
                    return op;
                  }),
                };
              }
              return q;
            }),
          };
        }
        return sec;
      });
    }

    return updatedForm;
  }

  static deleteIndependentQuestion(
    form: Form,
    sectionId: string,
    questionId: string
  ): Form {
    // First, remove any dependentOn variable in this question
    // Then remove the dependencies from the question and option(if available) it is dependent upon

    const section = form.sections.find((sec) => sec.SectionId === sectionId);
    if (!section) throw new Error(`Section with ID '${sectionId}' not found `);

    const question = section.questions.find(
      (ques) => ques.questionId === questionId
    );
    if (!question)
      throw new Error(`Question with ID '${questionId}' not found `);

    const isIndependent =
      !question.dependentOn || question.dependentOn.length === 0;
    if (!isIndependent)
      throw new Error(`Question '${sectionId}' is dependent question `);

    const dependentItems: { sectionTitle: string; questionText: string }[] = [];

    form.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        // Check question dependencies
        if (q.dependencies) {
          q.dependencies.forEach((dep) => {
            if (dep.questionId === questionId) {
              dependentItems.push({
                sectionTitle: sec.sectionTitle,
                questionText: q.questionText,
              });
            }
          });
        }

        // Check option dependencies
        q.options.forEach((opt) => {
          if (opt.dependencies) {
            opt.dependencies.forEach((dep) => {
              if (dep.questionId === questionId) {
                dependentItems.push({
                  sectionTitle: sec.sectionTitle,
                  questionText: q.questionText,
                });
              }
            });
          }
        });
      });
    });

    if (dependentItems.length > 0) {
      const dependentDescriptions = dependentItems
        .map(
          (item, index) =>
            `${index + 1}. Question "${item.questionText}" in Section "${
              item.sectionTitle
            }"`
        )
        .join("\n");

      throw new Error(
        `Cannot delete the independent question "${question.questionText}" because the following questions depend on it:\n${dependentDescriptions}\nPlease delete these dependent questions first.`
      );
    }
    // Step 4: Delete the question
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.filter((q) => q.questionId !== questionId),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  static updateQuestionTitle(
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

  static deleteDependentQuestion(
    form: Form,
    sectionId: string,
    questionId: string
  ): Form {
    // Remove dependencies referencing the deleted dependent question
    // Step 1: Identify the section and question
    const section = form.sections.find((sec) => sec.SectionId === sectionId);
    if (!section) {
      throw new Error(`Section with ID '${sectionId}' not found.`);
    }

    const question = section.questions.find((q) => q.questionId === questionId);
    if (!question) {
      throw new Error(
        `Question with ID '${questionId}' not found in section '${section.sectionTitle}'.`
      );
    }

    // Step 2: Check if the question is dependent
    const isDependent = question.dependentOn && question.dependentOn.length > 0;
    if (!isDependent) {
      throw new Error(
        `Question '${question.questionText}' is not a dependent question and cannot be deleted as such.`
      );
    }

    // Step 3: Check if the question still has dependencies to remove
    // @ts-ignore
    if (question.dependencies && question.dependencies.length > 0) {
      // @ts-ignore
      const dependencyDescriptions = question.dependencies
        .map((dep, index) => {
          const depSection = form.sections.find(
            (sec) => sec.SectionId === dep.sectionId
          );
          const depQuestion = depSection?.questions.find(
            (q) => q.questionId === dep.questionId
          );
          return `${index + 1}. Question "${
            depQuestion?.questionText
          }" in Section "${depSection?.sectionTitle}" expects answer "${
            dep.expectedAnswer
          }"`;
        })
        .join("\n");

      throw new Error(
        `Cannot delete the dependent question "${question.questionText}" because it still has dependencies:\n${dependencyDescriptions}\nPlease remove these dependencies first.`
      );
    }

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
            dependencies:
              opt.dependencies?.filter(
                (dep) => dep.questionId !== questionId
              ) || [],
          })),
        })),
      })),
    };

    const updatedForm: Form = {
      ...cleanedForm,
      sections: cleanedForm.sections.map((sec) =>
        sec.SectionId === sectionId
          ? {
              ...sec,
              questions: sec.questions.filter(
                (q) => q.questionId !== questionId
              ),
            }
          : sec
      ),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  static updateAnswerType(
    form: Form,
    sectionId: string,
    questionId: string,
    newType: QuestionType
  ): Form {
    // Step 1: Identify the section and question
    const section = form.sections.find((sec) => sec.SectionId === sectionId);
    if (!section) {
      throw new Error(`Section with ID '${sectionId}' not found.`);
    }

    const question = section.questions.find((q) => q.questionId === questionId);
    if (!question) {
      throw new Error(
        `Question with ID '${questionId}' not found in section '${section.sectionTitle}'.`
      );
    }

    // Step 2: Check dependencies based on newType
    // Example: If changing to a type that doesn't support options, ensure no options have dependencies
    if (!["single-select", "multi-select"].includes(newType)) {
      if (question.options.length > 0) {
        const optionsWithDependencies = question.options.filter(
          (opt) => opt.dependencies && opt.dependencies.length > 0
        );
        if (optionsWithDependencies.length > 0) {
          const dependentOptionDescriptions = optionsWithDependencies
            .map(
              (opt, index) =>
                `${index + 1}. Option "${opt.value || "Table Option"}"`
            )
            .join("\n");

          throw new Error(
            `Cannot update the answer type of "${question.questionText}" to "${newType}" because the following options have dependencies:\n${dependentOptionDescriptions}\nPlease remove these dependencies or delete the options first.`
          );
        }
      }
    }

    // Step 3: Check if options are empty
    if (question.options.length === 0) {
      // No options, safe to update
    } else {
      // Check if any options have dependencies
      const optionsWithDependencies = question.options.filter(
        (opt) => opt.dependencies && opt.dependencies.length > 0
      );
      if (optionsWithDependencies.length > 0) {
        const dependentOptionDescriptions = optionsWithDependencies
          .map((opt, index) => `${index + 1}. Option "${opt.value}"`)
          .join("\n");

        throw new Error(
          `Cannot update the answer type of "${question.questionText}" because the following options have dependencies:\n${dependentOptionDescriptions}\nPlease delete these dependencies first.`
        );
      }
      // Else, options exist but have no dependencies, safe to update
    }

    // Step 4: Update the answer type
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.questionId !== questionId) return q;
            return {
              ...q,
              type: newType,
              // Depending on the new type, you might want to reset options
              // For example, changing from 'single-select' to 'text' would make options irrelevant
              // Here, we'll clear options if the new type doesn't support them
              options: ["single-select", "multi-select"].includes(newType)
                ? q.options
                : [],
              // Optionally, you might want to clear dependencies if the type change affects them
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  static addRangeDependency(
    form: Form,
    sectionID: string,
    questionID: string,
    range: Range
  ): Form {
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionID) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.questionId !== questionID) return q;
            return {
              ...q,
              range: range,
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    return updatedForm;
  }

  static addDependency(
    form: Form,
    sectionID: string,
    questionID: string,
    dependency: DependencyCondition
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionID) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.questionId !== questionID) return q;
            return {
              ...q,
              dependencies: q.dependencies
                ? [...q.dependencies, dependency]
                : [dependency],
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
  }

  static shouldDisplayQuestion(
    _form: Form,
    _sectionId: string,
    question: Question,
    responses: Record<string, any>
  ): boolean {
    if (!question.dependencies || question.dependencies.length === 0) {
      return true;
    }

    return question.dependencies.every((dep) => {
      const prevAnswer = responses[dep.questionId];
      if (dep.expectedAnswer !== undefined) {
        return prevAnswer === dep.expectedAnswer;
      }
      if (dep.range !== undefined && typeof prevAnswer === "number") {
        // check for all the ranges
        const { minValue, maxValue } = dep.range[0];
        if (minValue !== undefined && prevAnswer < minValue) return false;
        if (maxValue !== undefined && prevAnswer > maxValue) return false;
        return true;
      }
      return false;
    });
  }

  // not required here, only required in frontend
  static evaluateDepencency(
    dependency: DependencyCondition,
    previousAnswer: string | number
  ): boolean {
    if (dependency.expectedAnswer !== undefined)
      return dependency.expectedAnswer === previousAnswer;

    if (dependency.range !== undefined && typeof previousAnswer === "number") {
      // Modify the below to check everthing in from index 0 to n-1
      const { minValue, maxValue } = dependency.range[0];
      if (minValue !== undefined && previousAnswer < minValue) return false;
      if (maxValue !== undefined && previousAnswer > maxValue) return false;
      return true;
    }
    return true;
  }
}
