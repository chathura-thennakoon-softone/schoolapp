CREATE TABLE [dbo].[Student] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]   NVARCHAR (400) NOT NULL,
    [LastName]    NVARCHAR (400) NULL,
    [Email]       NVARCHAR (400) NULL,
    [PhoneNumber] NVARCHAR (20)  NULL,
    [SSN]         NVARCHAR (20)  NULL,
    [Image]       NVARCHAR (400) NULL,
    [StartDate]   DATE           NULL,
    [IsActive]    BIT            NOT NULL,
    CONSTRAINT [PK_Student] PRIMARY KEY CLUSTERED ([Id] ASC)
);

