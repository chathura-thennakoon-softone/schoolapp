CREATE TABLE [dbo].[StudentCourseMap] (
    [StudentId]      INT           NOT NULL,
    [CourseId]       INT           NOT NULL,
    [EnrollmentDate] DATETIME2 (7) NOT NULL,
    CONSTRAINT [PK_StudentCourseMap] PRIMARY KEY CLUSTERED ([StudentId] ASC, [CourseId] ASC),
    CONSTRAINT [FK_StudentCourseMap_Course_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [dbo].[Course] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_StudentCourseMap_Student_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Student] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_StudentCourseMap_CourseId]
    ON [dbo].[StudentCourseMap]([CourseId] ASC);

