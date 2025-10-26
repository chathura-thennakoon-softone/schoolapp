CREATE TABLE [identity].[RefreshTokens] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [UserId]      INT            NOT NULL,
    [Token]       NVARCHAR (255) NOT NULL,
    [JwtId]       NVARCHAR (255) NOT NULL,
    [IpAddress]   NVARCHAR (45)  NULL,
    [UserAgent]   NVARCHAR (500) NULL,
    [DeviceName]  NVARCHAR (100) NULL,
    [IsUsed]      BIT            NOT NULL,
    [IsRevoked]   BIT            NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [ExpiryDate]  DATETIME2 (7)  NOT NULL,
    [UsedDate]    DATETIME2 (7)  NULL,
    [RevokedDate] DATETIME2 (7)  NULL,
    CONSTRAINT [PK_RefreshTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RefreshTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [identity].[AspNetUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_UserId]
    ON [identity].[RefreshTokens]([UserId] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_RefreshTokens_Token]
    ON [identity].[RefreshTokens]([Token] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_IsRevoked]
    ON [identity].[RefreshTokens]([IsRevoked] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_ExpiryDate]
    ON [identity].[RefreshTokens]([ExpiryDate] ASC);

