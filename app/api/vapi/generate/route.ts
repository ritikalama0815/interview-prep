
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json(
    { success: true, data: "VAPI SDK is ready to use" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid} = await request.json();

  try {
    const { text:questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Generate a ${type} for a ${role} with ${level} level of expertise in ${techstack}. The user ID is ${userid}. Please provide ${amount} examples. Please return questions
     with the following structure:
      ["Question 1", "Question 2", ...]. Please return only the questions, without any additional text, and donot return the user ID.
       Since it is going to be read my voice assistant
     please don't use any kind of markdown or code blocks, just return the text as plain text without any formatting. Thank you!`,
    });

    //store in the database
    const interview={
      role, type, level, amount, 
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized:true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString()
    }
    await db.collection("interviews").add(interview);
    return Response.json({ success:true}, {status: 200});
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        error
      },
      { status: 500 }
    );
  }
}