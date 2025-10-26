CREATE TABLE [dbo].[User] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [AspNetUserId] INT            NOT NULL,
    [FirstName]    NVARCHAR (100) NOT NULL,
    [LastName]     NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_AspNetUsers_AspNetUserId] FOREIGN KEY ([AspNetUserId]) REFERENCES [identity].[AspNetUsers] ([Id]) ON DELETE CASCADE,
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_User_AspNetUserId]
    ON [dbo].[User]([AspNetUserId] ASC);

