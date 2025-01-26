import { OptionType, TableData } from "./../../../interface/interface";
import { v4 as uuidv4 } from "uuid";
import {
  Attribute,
  FunctionDependency,
  Form,
  Option,
} from "../../../interface/interface";

export class OptionController {
  static addOption(
    form: Form,
    sectionId: string,
    questionId: string,
    type: OptionType,
    value?: string
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

    // Step 2: Create the new normal(not a table) option
    const newOption: Option = {
      optionId: uuidv4(),
      questionId,
      value: "New Option",
      dependencies: [],
      type,
    };
    if (!value) throw new Error("Value is required for normal option");
    else newOption.value = value;

    // Step 3: Add the new option to the question's options array
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
              options: [...q.options, newOption],
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  static deleteOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string
  ): Form {
    console.log("AddOptions is called");
    // Step 1: Identify the section, question, and option
    const section = form.sections.find((sec) => sec.SectionId === sectionId);
    if (!section) {
      throw new Error(
        `Reached Here. Section with ID '${sectionId}' not found.`
      );
    }
    const question = section.questions.find((q) => q.questionId === questionId);
    if (!question) {
      throw new Error(
        `Question with ID '${questionId}' not found in section '${section.sectionTitle}'.`
      );
    }
    const option = question.options.find((opt) => opt.optionId === optionId);
    if (!option) {
      throw new Error(
        `Option with ID '${optionId}' not found in question '${question.questionText}'.`
      );
    }

    // Step 2: Check if any dependencies reference this option's value in targetOptions
    const dependentItems: {
      sectionTitle: string;
      questionText: string;
      dependencyType: string;
    }[] = [];

    form.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        // Check question dependencies
        if (q.dependencies) {
          q.dependencies.forEach((dep) => {
            if (
              dep.dependencyType === "options" &&
              dep.targetOptions?.includes(option.value || "")
            ) {
              dependentItems.push({
                sectionTitle: sec.sectionTitle,
                questionText: q.questionText,
                dependencyType: dep.dependencyType,
              });
            }
          });
        }

        // Check option dependencies
        q.options.forEach((opt) => {
          if (opt.dependencies) {
            opt.dependencies.forEach((dep) => {
              if (
                dep.dependencyType === "options" &&
                dep.targetOptions?.includes(option.value || "")
              ) {
                dependentItems.push({
                  sectionTitle: sec.sectionTitle,
                  questionText: q.questionText,
                  dependencyType: dep.dependencyType,
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
            }" with Dependency Type "${item.dependencyType}"`
        )
        .join("\n");

      throw new Error(
        `Cannot delete the option "${option.value}" because the following questions depend on it:\n${dependentDescriptions}\nPlease remove these dependencies first.`
      );
    }

    // Step 3: Delete the option
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
              options: q.options.filter((opt) => opt.optionId !== optionId),
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    return updatedForm;
  }

  static updateOptionValue(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string,
    newValue: string
  ): Form {
    // Step 1: Identify the section, question, and option
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

    const option = question.options.find((opt) => opt.optionId === optionId);
    if (!option) {
      throw new Error(
        `Option with ID '${optionId}' not found in question '${question.questionText}'.`
      );
    }

    const oldValue = option.value;

    // Step 2: Update the option's value
    const updatedFormIntermediate: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.questionId !== questionId) return q;
            return {
              ...q,
              options: q.options.map((opt) => {
                if (opt.optionId !== optionId) return opt;
                return {
                  ...opt,
                  value: newValue,
                };
              }),
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };

    // Step 3: Update dependencies that reference the old option value
    const finalUpdatedForm = {
      ...updatedFormIntermediate,
      sections: updatedFormIntermediate.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) => ({
          ...q,
          dependencies: q.dependencies?.map((dep) => {
            if (dep.dependencyType === "options" && dep.targetOptions) {
              const updatedTargetOptions = dep.targetOptions.map((optVal) =>
                optVal === oldValue ? newValue : optVal
              );
              return {
                ...dep,
                targetOptions: updatedTargetOptions,
              };
            }
            return dep;
          }),
          options: q.options.map((opt) => ({
            ...opt,
            dependencies: opt.dependencies?.map((dep) => {
              if (dep.dependencyType === "options" && dep.targetOptions) {
                const updatedTargetOptions = dep.targetOptions.map((optVal) =>
                  optVal === oldValue ? newValue : optVal
                );
                return {
                  ...dep,
                  targetOptions: updatedTargetOptions,
                };
              }
              return dep;
            }),
          })),
        })),
      })),
    };

    return finalUpdatedForm;
  }

  static deleteOptionWithDependencies(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string
  ): Form {
    // This method is similar to deleteOption but can include additional logic if needed.
    // For now, it calls deleteOption.
    return this.deleteOption(form, sectionId, questionId, optionId);
  }

  static addTableOption(
    form: Form,
    sectionId: string,
    questionId: string,
    tableData: { rows: Attribute[]; columns: string[] }
  ) {}

  static updateTableAttributeValue(
    form: Form,
    sectionID: string,
    questionId: string,
    optionID: string,
    attributeID: string,
    newValue: string
  ): Form {
    // Identify section, question, table option, and attribute
    const section = form.sections.find((sec) => sec.SectionId === sectionID);
    if (!section) {
      throw new Error(`Section with ID '${sectionID}' not found.`);
    }
    const question = section.questions.find((q) => q.questionId === questionId);
    if (!question) {
      throw new Error(
        `Question with ID '${questionId}' not found in section '${section.sectionTitle}'.`
      );
    }
    const option = question.options.find((opt) => opt.optionId === optionID);
    if (!option) {
      throw new Error(
        `Option with ID '${optionID}' not found in question '${question.questionText}'.`
      );
    }
    if (option.type !== "table" || !option.tableData) {
      throw new Error(
        `Option with ID '${optionID}' is not a table option in question '${question.questionText}'.`
      );
    }

    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((sec) => {
        if (sec.SectionId !== sectionID) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.questionId !== questionId) return q;
            return {
              ...q,
              options: q.options.map((opt) => {
                if (opt.optionId !== optionID) return opt;
                return {
                  ...opt,
                  tableData: {
                    ...opt.tableData!,
                    rows: opt.tableData!.rows.map((attr) => {
                      if (attr.attributeId !== attributeID) return attr;
                      return {
                        ...attr,
                        value: newValue,
                      };
                    }),
                  },
                };
              }),
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    return updatedForm;
  }

  static deleteTableOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string
  ) {
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
    const option = question.options.find((opt) => opt.optionId === optionId);
    if (!option) {
      throw new Error(
        `Option with ID '${optionId}' not found in question '${question.questionText}'.`
      );
    }
    if (option.type !== "table" || !option.tableData) {
      throw new Error(
        `Option with ID '${optionId}' is not a table option in question '${question.questionText}'.`
      );
    }

    const dependentItems: {
      sectionTitle: string;
      questionText: string;
      dependencyType: string;
    }[] = [];

    option.tableData.rows.forEach((attr) => {
      form.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          q.options.forEach((opt) => {
            if (opt.dependencies) {
              opt.dependencies.forEach((dep) => {
                if (dep.dependencyType === "options" && dep.targetOptions) {
                  if (dep.targetOptions.includes(attr.attributeId)) {
                    dependentItems.push({
                      sectionTitle: sec.sectionTitle,
                      questionText: q.questionText,
                      dependencyType: dep.dependencyType,
                    });
                  }
                }
              });
            }
            q.options.forEach((opt) => {
              if (opt.dependencies) {
                opt.dependencies.forEach((dep) => {
                  if (
                    dep.dependencyType === "options" &&
                    dep.targetOptions?.includes(attr.value.toString())
                  ) {
                    dependentItems.push({
                      sectionTitle: sec.sectionTitle,
                      questionText: q.questionText,
                      dependencyType: dep.dependencyType,
                    });
                  }
                });
              }
            });
          });
        });
      });
    });
    if (dependentItems.length > 0) {
      const dependentDescription = dependentItems
        .map(
          (item, index) =>
            `${index + 1}. ${item.sectionTitle}: ${item.questionText}`
        )
        .join("\n");
      throw new Error(
        `Option with ID '${optionId}' has dependencies on the following items:\n${dependentDescription}`
      );
    }

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
              options: q.options.filter((opt) => opt.optionId !== optionId),
            };
          }),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    return updatedForm;
  }

  static evaluateFunctionDependency(
    expression: string,
    varaibles: Record<string, any>
  ): number {
    const func = new Function(
      ...Object.keys(varaibles),
      `return ${expression}`
    );
    return func(...Object.values(varaibles));
  }

  static evaluateAttributeValue(
    funcDep: FunctionDependency,
    responses: Record<string, any>
  ): number | string {
    try {
      const compiled = math.compile(funcDep.expression);
      const scope = { ...responses };
      const result = compiled.evaluate(scope);
      return result;
    } catch (error) {
      console.error("Error evaluating function dependency:", error);
      return "Error";
    }
  }
}
