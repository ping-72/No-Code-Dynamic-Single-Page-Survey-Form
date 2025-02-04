import { v4 as uuidv4 } from "uuid";
import { Form, Option, TableData } from "../../../interface/interface";

export class TableOptionController {
  static addTableOption(
    form: Form,
    sectionId: string,
    questionId: string,
    tableData: TableData
  ) {
    const newOption: Option = {
      optionId: uuidv4(),
      questionId: questionId,
      type: "table",
      tableData: tableData,
    };
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((section) => {
        if (section.SectionId === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.questionId === questionId) {
                return {
                  ...question,
                  options: [...question.options, newOption],
                };
              }
              return question;
            }),
          };
        }
        return section;
      }),
    };
    return updatedForm;
  }

  static deleteTableOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string
  ) {
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((section) => {
        if (section.SectionId === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.questionId === questionId) {
                return {
                  ...question,
                  options: question.options.filter(
                    (option) => option.optionId !== optionId
                  ),
                };
              }
              return question;
            }),
          };
        }
        return section;
      }),
    };
    return updatedForm;
  }

  static updateTableOption(
    form: Form,
    sectionId: string,
    questionId: string,
    optionId: string,
    newValue: TableData
  ) {
    const updatedForm: Form = {
      ...form,
      sections: form.sections.map((section) => {
        if (section.SectionId === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.questionId === questionId) {
                return {
                  ...question,
                  options: question.options.map((option) => {
                    if (option.optionId === optionId) {
                      return {
                        ...option,
                        tableData: newValue,
                        value: newValue,
                      };
                    }
                    return option;
                  }),
                };
              }
              return question;
            }),
          };
        }
        return section;
      }),
    };
    return updatedForm;
  }
}
