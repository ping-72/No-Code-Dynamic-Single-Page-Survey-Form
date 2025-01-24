// src/formController/OptionController.ts

import { v4 as uuidv4 } from "uuid";
import { Form, Option } from "../../../interface/interface";

export class OptionController {
  static addOption(form: Form, sectionId: string, questionId: string): Form {
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

    // Step 2: Create the new option
    const newOption: Option = {
      optionId: uuidv4(),
      questionId,
      value: "New Option",
      dependencies: [],
    };

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
              dep.targetOptions?.includes(option.value)
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
                dep.targetOptions?.includes(option.value)
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
}
