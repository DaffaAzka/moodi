import "server-only";

import { cache } from "react";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const subtestListSelect = {
  id: true,
  code: true,
  name: true,
  defaultSeconds: true,
  _count: { select: { topics: true } },
} satisfies Prisma.SubtestSelect;

const subtestTopicListSelect = {
  id: true,
  name: true,
  topics: {
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      subtestId: true,
      _count: { select: { questions: true } },
    },
  },
} satisfies Prisma.SubtestSelect;

const topicChoiceSelect = {
  id: true,
  name: true,
  subtest: { select: { name: true } },
} satisfies Prisma.TopicSelect;

const questionEditorSelect = {
  id: true,
  topicId: true,
  difficulty: true,
  stem: true,
  imageUrl: true,
  explanation: true,
  expectedSeconds: true,
  isPublished: true,
  options: {
    orderBy: { label: "asc" },
    select: { id: true, body: true, label: true, isCorrect: true },
  },
} satisfies Prisma.QuestionSelect;

const questionListSelect = {
  id: true,
  stem: true,
  difficulty: true,
  isPublished: true,
  topic: {
    select: {
      id: true,
      name: true,
      subtest: { select: { id: true, name: true } },
    },
  },
  _count: { select: { options: true } },
} satisfies Prisma.QuestionSelect;

export type SubtestListItem = Prisma.SubtestGetPayload<{
  select: typeof subtestListSelect;
}>;
export type QuestionEditorData = Prisma.QuestionGetPayload<{
  select: typeof questionEditorSelect;
}>;
export type QuestionListItem = Prisma.QuestionGetPayload<{
  select: typeof questionListSelect;
}>;

export const getSubtests = cache(async () =>
  prisma.subtest.findMany({
    orderBy: { name: "asc" },
    select: subtestListSelect,
  }),
);

export const getTopicManagerData = cache(async () => {
  const subtests = await prisma.subtest.findMany({
    orderBy: { name: "asc" },
    select: subtestTopicListSelect,
  });

  return {
    subtests: subtests.map(({ id, name }) => ({ id, name })),
    topics: subtests.flatMap((subtest) =>
      subtest.topics.map((topic) => ({
        id: topic.id,
        name: topic.name,
        subtestId: topic.subtestId,
        subtestName: subtest.name,
        questionCount: topic._count.questions,
      })),
    ),
  };
});

export type TopicManagerData = Awaited<ReturnType<typeof getTopicManagerData>>;

export const getQuestionTopicChoices = cache(async () => {
  const topics = await prisma.topic.findMany({
    orderBy: [{ subtest: { name: "asc" } }, { name: "asc" }],
    select: topicChoiceSelect,
  });

  return topics.map(({ id, name, subtest }) => ({
    id,
    name,
    subtestName: subtest.name,
  }));
});

export type QuestionTopicChoice = Awaited<
  ReturnType<typeof getQuestionTopicChoices>
>[number];

export const getQuestionEditorData = cache(async (questionId: string) =>
  prisma.question.findUnique({
    where: { id: questionId },
    select: questionEditorSelect,
  }),
);

export const QUESTION_PAGE_SIZE = 50;

export interface QuestionFilterParams {
  subtestId?: string;
  topicId?: string;
}

export const getQuestions = cache(
  async (page: number, filters?: QuestionFilterParams) => {
    const where: Prisma.QuestionWhereInput = {};

    if (filters?.topicId) {
      where.topicId = filters.topicId;
    } else if (filters?.subtestId) {
      where.topic = { subtestId: filters.subtestId };
    }

    const [results, totalCount] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * QUESTION_PAGE_SIZE,
        take: QUESTION_PAGE_SIZE + 1,
        select: questionListSelect,
      }),
      prisma.question.count({ where }),
    ]);

    return {
      questions: results.slice(0, QUESTION_PAGE_SIZE),
      page,
      hasNextPage: results.length > QUESTION_PAGE_SIZE,
      totalCount,
    };
  },
);

export const getQuestionFiltersData = cache(async () => {
  const subtests = await prisma.subtest.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      topics: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          _count: { select: { questions: true } },
        },
      },
    },
  });

  return subtests;
});

export type QuestionFiltersData = Awaited<
  ReturnType<typeof getQuestionFiltersData>
>;

export const getQuestionBankCounts = cache(async () => {
  const [subtestCount, topicCount, publishedCount, draftCount] =
    await Promise.all([
      prisma.subtest.count(),
      prisma.topic.count(),
      prisma.question.count({ where: { isPublished: true } }),
      prisma.question.count({ where: { isPublished: false } }),
    ]);

  return { subtestCount, topicCount, publishedCount, draftCount };
});

export type QuestionBankCounts = Awaited<
  ReturnType<typeof getQuestionBankCounts>
>;
