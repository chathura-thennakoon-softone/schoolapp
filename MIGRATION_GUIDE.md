# Database Migration Guide - Dual Context Architecture

## 📋 Overview

Your application now uses **TWO separate DbContexts**:
- **IdentityContext** → `identity` schema (Auth tables)
- **SCHContext** → `dbo` schema (Domain tables + User table)

Both contexts use the **same database** but different schemas.

---

## 🚨 Step 1: Delete Old Migrations

Your existing migrations are **OUTDATED** because they were created before the context split.

**Delete these files:**
```
SCH/SCH.Repositories/Migrations/
├── 20250815143124_AddSCH.cs                    ❌ DELETE
├── 20250815143124_AddSCH.Designer.cs           ❌ DELETE
├── 20250908055942_AddTeacher.cs                ❌ DELETE
├── 20250908055942_AddTeacher.Designer.cs       ❌ DELETE
└── SCHContextModelSnapshot.cs                  ❌ DELETE
```

**Why delete?**
- These migrations include Identity tables (now in IdentityContext)
- They don't have schema separation
- They don't include the new User table

---

## 📦 Step 2: Verify Folder Structure

After deletion, create new migration folders:

```
SCH/SCH.Repositories/
├── Migrations/                    ← Keep this folder (will be empty)
│   └── Identity/                  ← Create this subfolder
└── DbContexts/
    ├── IdentityContext.cs         ✅
    ├── IdentityContextFactory.cs  ✅ (just created)
    ├── SCHContext.cs              ✅
    └── SCHContextFactory.cs       ✅ (updated)
```

---

## 🔧 Step 3: Package Manager Console Commands

Open **Package Manager Console** in Visual Studio:
- Tools → NuGet Package Manager → Package Manager Console
- Set **Default project** to `SCH.Repositories`

### **3A. Create IdentityContext Migration (identity schema)**

```powershell
# Create initial migration for Identity tables
# -Project: Where migrations are stored
# -StartupProject: Where appsettings.json is located
Add-Migration InitialIdentity -Context IdentityContext -OutputDir Migrations/Identity -StartupProject SCH.Repositories

# Review the migration file, then apply it
Update-Database -Context IdentityContext  -StartupProject SCH.Repositories
```

**This creates:**
- `identity.AspNetUsers`
- `identity.AspNetRoles`
- `identity.AspNetUserRoles`
- `identity.AspNetUserClaims`
- `identity.AspNetUserLogins`
- `identity.AspNetUserTokens`
- `identity.AspNetRoleClaims`
- `identity.RefreshTokens`
- `identity.__EFMigrationsHistory`

---

### **3B. Create SCHContext Migration (dbo schema)**

```powershell
# Create initial migration for Domain tables
# -Project: Where migrations are stored
# -StartupProject: Where appsettings.json is located
Add-Migration InitialDomain -Context SCHContext -OutputDir Migrations -StartupProject SCH.Repositories

# Review the migration file, then apply it
Update-Database -Context SCHContext -StartupProject SCH.Repositories
```

**This creates:**
- `dbo.User` (NEW - links to identity.AspNetUsers)
- `dbo.Student`
- `dbo.Course`
- `dbo.Teacher`
- `dbo.StudentCourseMap`
- `dbo.__EFMigrationsHistory`

---

## 📂 Expected Result

After running migrations, your folder structure will be:

```
SCH/SCH.Repositories/Migrations/
├── Identity/
│   ├── 20250126xxxxxx_InitialIdentity.cs
│   ├── 20250126xxxxxx_InitialIdentity.Designer.cs
│   └── IdentityContextModelSnapshot.cs
│
├── 20250126xxxxxx_InitialDomain.cs
├── 20250126xxxxxx_InitialDomain.Designer.cs
└── SCHContextModelSnapshot.cs
```

---

## 🗄️ Database Schema Result

Your database will have **TWO schemas**:

```sql
-- Identity Schema (Auth)
identity.__EFMigrationsHistory
identity.AspNetUsers
identity.AspNetRoles
identity.AspNetUserRoles
identity.AspNetUserClaims
identity.AspNetUserLogins
identity.AspNetUserTokens
identity.AspNetRoleClaims
identity.RefreshTokens

-- DBO Schema (Domain)
dbo.__EFMigrationsHistory
dbo.User                    -- NEW! Links to identity.AspNetUsers
dbo.Student
dbo.Course
dbo.Teacher
dbo.StudentCourseMap
```

---

## 📖 Understanding Migration Files

### **What is a Snapshot file?**
`*ContextModelSnapshot.cs` represents the **current state** of your database model.

- **Auto-generated** by EF Core
- Used to calculate differences for new migrations
- **Don't edit manually**
- One snapshot per context

### **What are Migration files?**
`YYYYMMDDhhmmss_MigrationName.cs` files contain:
- `Up()` method - applies changes (creates tables, columns, etc.)
- `Down()` method - reverts changes (drops tables, columns, etc.)

### **What are Designer files?**
`*_MigrationName.Designer.cs` files contain metadata:
- Model snapshot at the time of migration
- Used by EF Core internally
- **Don't edit manually**

---

## 🔄 Future Migrations

When you change models, create new migrations:

### **For Identity changes (auth tables):**
```powershell
Add-Migration MigrationName -Context IdentityContext -OutputDir Migrations/Identity  -StartupProject SCH.Repositories
Update-Database -Context IdentityContext  -StartupProject SCH.Repositories
```

### **For Domain changes (business tables):**
```powershell
Add-Migration MigrationName -Context SCHContext -OutputDir Migrations  -StartupProject SCH.Repositories
Update-Database -Context SCHContext  -StartupProject SCH.Repositories
```

---

## ⚠️ Important Notes

### **1. Migration History Tables**
Each context has its own migration history:
- `identity.__EFMigrationsHistory` (for IdentityContext)
- `dbo.__EFMigrationsHistory` (for SCHContext)

### **2. Same Database, Different Schemas**
Both contexts use the **same connection string** but manage different schemas.

### **3. User Table Linking**
The `dbo.User` table has `AspNetUserId` column that references `identity.AspNetUsers.Id`.
However, **cross-schema foreign keys are not enforced in migrations** - you may need to add this manually if needed.

### **4. Seeding Roles**
After running migrations, seed default roles:
```csharp
// In your startup or seed class
await roleManager.CreateAsync(new ApplicationRole 
{ 
    Name = "Admin", 
    Description = "Administrator role" 
});

await roleManager.CreateAsync(new ApplicationRole 
{ 
    Name = "Basic", 
    Description = "Basic user role" 
});
```

---

## 🐛 Troubleshooting

### **Error: "A context with type 'X' was not found"**
- Ensure you're in `SCH.Repositories` directory
- Check that `*ContextFactory.cs` files exist

### **Error: "Unable to create an object of type 'X'"**
- Verify `appsettings.json` exists in `SCH.Api`
- Check `DefaultConnection` connection string is valid

### **Error: "The entity type 'X' requires a primary key"**
- Check your entity configurations in `OnModelCreating`
- Ensure all entities have `HasKey()` configured

### **Database already has tables?**
If your database already has the old tables:
1. **Backup your data!**
2. Drop all existing tables
3. Run fresh migrations
4. Restore data if needed

---

## ✅ Verification

After migrations, verify your database:

```sql
-- Check schemas exist
SELECT * FROM sys.schemas WHERE name IN ('identity', 'dbo');

-- Check Identity tables
SELECT * FROM identity.__EFMigrationsHistory;
SELECT * FROM identity.AspNetUsers;
SELECT * FROM identity.RefreshTokens;

-- Check Domain tables
SELECT * FROM dbo.__EFMigrationsHistory;
SELECT * FROM dbo.[User];
SELECT * FROM dbo.Student;
SELECT * FROM dbo.Course;
```

---

## 🎯 Summary Checklist

- [ ] Delete old migration files from `/Migrations/`
- [ ] Create `IdentityContextFactory.cs`
- [ ] Update `SCHContextFactory.cs` with schema config
- [ ] Run `Add-Migration InitialIdentity -Context IdentityContext`
- [ ] Run `Update-Database -Context IdentityContext`
- [ ] Run `Add-Migration InitialDomain -Context SCHContext`
- [ ] Run `Update-Database -Context SCHContext`
- [ ] Verify both schemas in database
- [ ] Seed default roles (Admin, Basic)
- [ ] Test registration and login

---

**Your database is now ready with clean schema separation!** 🚀

