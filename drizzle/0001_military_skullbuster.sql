CREATE TABLE `pitch_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL,
	`clarity` int NOT NULL,
	`pacing` int NOT NULL,
	`persuasion` int NOT NULL,
	`transcript` text NOT NULL,
	`feedback` json NOT NULL,
	`recordingDuration` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pitch_analyses_id` PRIMARY KEY(`id`)
);
