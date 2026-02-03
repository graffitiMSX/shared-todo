# Future Features & Enhancements

This document tracks features planned for future versions of the Shared Todo app.

## 📋 Planned Features

### High Priority

#### 1. Clone/Reuse Todo
**Description:** Ability to duplicate an existing todo with all its details

**Use Cases:**
- Recurring shopping lists
- Weekly meal planning
- Regular appointment reminders
- Template todos for common tasks

**Implementation Details:**
- Add "Clone" button to todo actions
- Copy all fields: title, description, due date/time
- Copy checklist items (with all unchecked)
- Copy metadata (phone, link, address, note)
- Option to share with same participants
- Keep notifications settings
- Generate new unique ID

**UI/UX:**
- Clone button next to Edit/Delete in TodoCard
- Show toast notification: "Todo cloned successfully"
- Open cloned todo in edit mode
- Allow user to modify before saving

**Database:**
- No new tables needed
- Programmatic duplication of existing data
- Use existing hooks with new IDs

---

### Medium Priority

#### 2. Todo Templates
**Description:** Save frequently used todos as templates

**Features:**
- Create template from existing todo
- Template library page
- Quick create from template
- Categories for templates (shopping, health, work, etc.)

#### 3. Recurring Todos
**Description:** Automatically recreate todos on a schedule

**Features:**
- Daily, weekly, monthly, custom schedules
- Auto-create X days before due date
- Stop after X occurrences or end date
- Notification for new recurring todo

#### 4. Subtasks / Nested Checklists
**Description:** Add sub-items to checklist items

**Features:**
- Indent/outdent checklist items
- Collapse/expand parent items
- Progress rolls up to parent

#### 5. Tags/Categories
**Description:** Organize todos with tags

**Features:**
- Add multiple tags per todo
- Color-coded tags
- Filter by tag
- Tag suggestions

#### 6. Attachments
**Description:** Attach files/images to todos

**Features:**
- Upload images (receipts, photos)
- Attach PDFs (tickets, confirmations)
- View in-app
- Supabase Storage integration

---

### Lower Priority

#### 7. Drag & Drop Reordering
**Description:** Manual ordering of todos and checklist items

**Features:**
- Drag todos to reorder
- Drag checklist items within list
- Persist custom order

#### 8. Rich Text Descriptions
**Description:** Formatted text in descriptions

**Features:**
- Bold, italic, underline
- Bullet/numbered lists
- Links
- Markdown support

#### 9. Activity Log
**Description:** History of changes to todos

**Features:**
- Who changed what and when
- Revert changes
- Activity feed per todo

#### 10. Calendar View
**Description:** View todos on a calendar

**Features:**
- Month/week/day views
- Drag to change due date
- Color coding by type/tag
- Export to iCal

---

## 🎯 Implementation Priority

### MVP++ (After Phase 10)
1. Clone/Reuse Todo ⭐
2. Todo Templates
3. Recurring Todos

### Version 1.1
4. Subtasks
5. Tags/Categories
6. Attachments

### Version 1.2
7. Drag & Drop
8. Rich Text
9. Activity Log
10. Calendar View

---

## 💡 User Requests

**Clone/Reuse Todo** - Requested by user for grocery shopping lists and recurring tasks

---

## 📝 Notes

- All features should maintain multi-language support
- Ensure RLS policies cover new tables/features
- Keep mobile UX in mind
- Consider offline support for mobile apps
- Monitor database performance with new features
