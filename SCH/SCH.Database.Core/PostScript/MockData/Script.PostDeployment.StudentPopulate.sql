/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
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