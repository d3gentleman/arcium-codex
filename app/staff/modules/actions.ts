"use server";

import { query } from "@/lib/db";
import { requireStaffSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveModuleLesson(formData: FormData) {
  await requireStaffSession();

  const isEdit = formData.get("isEdit") === "true";
  const originalSlug = formData.get("originalSlug") as string;

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const tag = (formData.get("tag") as string) || "Module";
  const summary = formData.get("summary") as string;
  const introductionHeading = formData.get("introductionHeading") as string;
  const introduction = formData.get("introduction") as string;
  const visualizationId = formData.get("visualizationId") as string;
  
  const bodySectionsStr = formData.get("bodySections") as string;
  const quizQuestionsStr = formData.get("quizQuestions") as string;

  console.log(`Saving module: ${title} (${slug}) - isEdit: ${isEdit}`);

  let bodySections = [];
  let quizQuestions = [];

  try {
    if (bodySectionsStr) bodySections = JSON.parse(bodySectionsStr);
    if (quizQuestionsStr) quizQuestions = JSON.parse(quizQuestionsStr);
  } catch (e) {
    console.error("Failed to parse JSON for bodySections or quizQuestions");
    throw new Error("Invalid JSON data");
  }

  if (isEdit && originalSlug) {
    await query(
      `UPDATE module_lesson 
       SET slug = $1, title = $2, category_id = $3, tag = $4, summary = $5, introduction = $6, introduction_heading = $7, visualization_id = $8, body_sections = $9, quiz_questions = $10, updated_at = NOW()
       WHERE slug = $11`,
      [slug, title, categoryId, tag, summary, introduction || null, introductionHeading || null, visualizationId || null, JSON.stringify(bodySections), JSON.stringify(quizQuestions), originalSlug]
    );
  } else {
    await query(
      `INSERT INTO module_lesson (slug, title, category_id, tag, summary, introduction, introduction_heading, visualization_id, body_sections, quiz_questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [slug, title, categoryId, tag, summary, introduction || null, introductionHeading || null, visualizationId || null, JSON.stringify(bodySections), JSON.stringify(quizQuestions)]
    );
  }

  revalidatePath("/modules");
  revalidatePath(`/modules/${slug}`);
  revalidatePath("/staff/modules");

  redirect("/staff/modules");
}

export async function deleteModuleLesson(slug: string) {
  await requireStaffSession();

  await query(`DELETE FROM module_lesson WHERE slug = $1`, [slug]);

  revalidatePath("/modules");
  revalidatePath("/staff/modules");
  
  redirect("/staff/modules");
}
