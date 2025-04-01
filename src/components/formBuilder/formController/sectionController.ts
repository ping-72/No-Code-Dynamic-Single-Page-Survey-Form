import { Form, Section } from "../../../interface/interface";
import { v4 as uuidv4 } from "uuid";

export class SectionController {
  static addSection(form: Form): Form {
    const newSection: Section = {
      SectionId: uuidv4(),
      formId: form.formId,
      sectionTitle: "New Section",
      description: "",
      questions: [],
      order: form.sections.length,
      createdAt: new Date().toISOString(),
      type: "regular",
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

  static updateSectionDescription(
    form: Form,
    sectionId: string,
    description: string
  ): Form {
    return {
      ...form,
      sections: form.sections.map((sec) =>
        sec.SectionId === sectionId ? { ...sec, description } : sec
      ),
      updatedAt: new Date().toISOString(),
    };
  }
}
