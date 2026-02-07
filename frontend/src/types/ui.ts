import type { ReactNode } from "react";

import type { Notification } from "./notification";
import type { Question } from "./question";
import type { Tag } from "./tag";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "accent"
  | "outline";

export type MetricAccent = "indigo" | "emerald" | "sky" | "amber" | "slate";

export type MetricCardData = {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: ReactNode;
  accent?: MetricAccent;
  className?: string;
};

export type TagChipData = {
  label: string;
  active?: boolean;
  icon?: ReactNode;
};

export type QuestionMeta = {
  author: string;
  time: string;
};

export type QuestionStats = {
  answers: number;
  views: number;
  votes?: number;
};

export type QuestionCardData = {
  question: Question;
  tags: Tag[];
  meta: QuestionMeta;
  stats: QuestionStats;
  statusLabel?: string;
  statusVariant?: BadgeVariant;
  leading?: ReactNode;
  action?: ReactNode;
};

export type NotificationItemData = {
  notification: Notification;
  title: string;
  message: string;
  time: string;
  icon?: ReactNode;
  isNew?: boolean;
  badgeLabel?: string;
};
