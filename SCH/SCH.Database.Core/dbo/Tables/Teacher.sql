CREATE TABLE [dbo].[Teacher] (
    [Id]   INT            IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (400) NOT NULL,
    CONSTRAINT [PK_Teacher] PRIMARY KEY CLUSTERED ([Id] ASC)
);

