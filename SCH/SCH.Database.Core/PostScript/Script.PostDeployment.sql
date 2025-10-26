﻿/*
Post-Deployment Script - Seed Data							
--------------------------------------------------------------------------------------
 This script seeds Identity (roles, admin user) and domain data (students).
--------------------------------------------------------------------------------------
*/

-- =============================================
-- SECTION 1: Seed Roles (Admin and Basic)
-- =============================================
IF NOT EXISTS (SELECT 1 FROM [identity].[AspNetRoles] WHERE [Name] = 'Admin')
BEGIN
    INSERT INTO [identity].[AspNetRoles]
    (
        [Name],
        [NormalizedName],
        [ConcurrencyStamp],
        [Description],
        [IsActive],
        [CreatedDate]
    )
    VALUES
    (
        'Admin',
        'ADMIN',
        NEWID(),
        'Administrator role with full access',
        1,
        GETUTCDATE()
    );
    
    PRINT 'Admin role created';
END

IF NOT EXISTS (SELECT 1 FROM [identity].[AspNetRoles] WHERE [Name] = 'Basic')
BEGIN
    INSERT INTO [identity].[AspNetRoles]
    (
        [Name],
        [NormalizedName],
        [ConcurrencyStamp],
        [Description],
        [IsActive],
        [CreatedDate]
    )
    VALUES
    (
        'Basic',
        'BASIC',
        NEWID(),
        'Basic user role with limited access',
        1,
        GETUTCDATE()
    );
    
    PRINT 'Basic role created';
END

GO

-- =============================================
-- SECTION 2: Seed Admin User
-- =============================================
-- Password: Admin123!
-- This is a default password - CHANGE IT IN PRODUCTION!

DECLARE @AdminUserId INT;
DECLARE @AdminRoleId INT;

-- Check if admin user already exists
IF NOT EXISTS (SELECT 1 FROM [identity].[AspNetUsers] WHERE [UserName] = 'admin')
BEGIN
    -- Insert Admin User
    INSERT INTO [identity].[AspNetUsers]
    (
        [UserName],
        [NormalizedUserName],
        [Email],
        [NormalizedEmail],
        [EmailConfirmed],
        [PasswordHash],
        [SecurityStamp],
        [ConcurrencyStamp],
        [PhoneNumber],
        [PhoneNumberConfirmed],
        [TwoFactorEnabled],
        [LockoutEnd],
        [LockoutEnabled],
        [AccessFailedCount],
        [FirstName],
        [LastName],
        [IsActive],
        [CreatedDate],
        [LastLoginDate]
    )
    VALUES
    (
        'admin',                                                                    -- UserName
        'ADMIN',                                                                    -- NormalizedUserName
        'admin@schoolapp.com',                                                      -- Email
        'ADMIN@SCHOOLAPP.COM',                                                      -- NormalizedEmail
        1,                                                                          -- EmailConfirmed
        'AQAAAAIAAYagAAAAEJ7KzRZdCqVHxE0Zq0x0xGqB9nY8fZRW9Y8nW8xV0vKqVHxE0Zq0x0xGqB9nY8fZ==', -- PasswordHash for "Admin123!"
        NEWID(),                                                                    -- SecurityStamp
        NEWID(),                                                                    -- ConcurrencyStamp
        NULL,                                                                       -- PhoneNumber
        0,                                                                          -- PhoneNumberConfirmed
        0,                                                                          -- TwoFactorEnabled
        NULL,                                                                       -- LockoutEnd
        1,                                                                          -- LockoutEnabled
        0,                                                                          -- AccessFailedCount
        'System',                                                                   -- FirstName
        'Administrator',                                                            -- LastName
        1,                                                                          -- IsActive
        GETUTCDATE(),                                                               -- CreatedDate
        NULL                                                                        -- LastLoginDate
    );
    
    SET @AdminUserId = SCOPE_IDENTITY();
    PRINT 'Admin user created with UserId: ' + CAST(@AdminUserId AS NVARCHAR(10));
    
    -- Get Admin Role Id
    SELECT @AdminRoleId = [Id] FROM [identity].[AspNetRoles] WHERE [Name] = 'Admin';
    
    -- Assign Admin role to Admin user
    IF NOT EXISTS (SELECT 1 FROM [identity].[AspNetUserRoles] WHERE [UserId] = @AdminUserId AND [RoleId] = @AdminRoleId)
    BEGIN
        INSERT INTO [identity].[AspNetUserRoles]
        (
            [UserId],
            [RoleId]
        )
        VALUES
        (
            @AdminUserId,
            @AdminRoleId
        );
        
        PRINT 'Admin role assigned to admin user';
    END
    
    -- Create corresponding domain user record
    IF NOT EXISTS (SELECT 1 FROM [dbo].[User] WHERE [AspNetUserId] = @AdminUserId)
    BEGIN
        INSERT INTO [dbo].[User]
        (
            [AspNetUserId],
            [FirstName],
            [LastName]
        )
        VALUES
        (
            @AdminUserId,
            'System',
            'Administrator'
        );
        
        PRINT 'Domain user record created for admin';
    END
END
ELSE
BEGIN
    PRINT 'Admin user already exists';
END

GO

-- =============================================
-- SECTION 3: Seed Student Mock Data
-- =============================================
IF NOT EXISTS
(
    SELECT
    1
    FROM [dbo].[Student]
)
BEGIN
    INSERT INTO [dbo].[Student]
    (
	    [FirstName]
        ,[LastName]
        ,[Email]
        ,[PhoneNumber]
        ,[SSN]
        ,[Image]
        ,[StartDate]
        ,[IsActive]
    )
    VALUES
    (
	    'FirstName1'
        ,'LastName1'
        ,'email1@mail.com'
        ,'phonenumber1'
        ,'ssn1'
        ,'image1'
        ,'2024-11-11'
        ,1
    ),
    (
	    'FirstName2'
        ,'LastName2'
        ,'email2@mail.com'
        ,'phonenumber2'
        ,'ssn2'
        ,'image2'
        ,'2024-11-12'
        ,1
    ),
    (
	    'FirstName3'
        ,'LastName3'
        ,'email3@mail.com'
        ,'phonenumber3'
        ,'ssn3'
        ,'image3'
        ,'2024-11-13'
        ,1
    ),
    (
	    'FirstName4'
        ,'LastName4'
        ,'email4@mail.com'
        ,'phonenumber4'
        ,'ssn4'
        ,'image4'
        ,'2024-11-14'
        ,1
    ),
    (
	    'FirstName5'
        ,'LastName5'
        ,'email5@mail.com'
        ,'phonenumber5'
        ,'ssn5'
        ,'image5'
        ,'2024-11-15'
        ,0
    ),
    (
	    'FirstName6'
        ,'LastName6'
        ,'email6@mail.com'
        ,'phonenumber6'
        ,'ssn6'
        ,'image6'
        ,'2024-11-16'
        ,1
    )

END

GO