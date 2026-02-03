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

#### 10. Calendar View (Enhanced)
**Description:** Full calendar view for appointments and time-based todos

**Features:**
- Month/week/day views
- Day view with hourly time slots (agenda style)
- Drag to change due date
- Drag to change time period
- Color coding by type/tag
- Appointment blocks showing duration
- Export to iCal/Google Calendar
- Sync with device calendar (Capacitor)

**UI/UX:**
- Week view as default on mobile
- Month view as default on desktop
- Tap day to see day agenda
- Long-press time slot to create todo
- Visual distinction between:
  - Pending todos (no time)
  - Due date todos (pinned to day)
  - Period-based todos (time blocks)

#### 11. Time Period / Duration Todos
**Description:** Todos with time periods (from-to) instead of just due dates

**Types:**
1. **Pending Todo** - No date, just a task to complete
2. **Due Date Todo** - Has a specific due date/time deadline
3. **Period Todo** - Has a start time and end time (appointments, meetings)

**Features:**
- Start date/time picker
- End date/time picker (auto-set to 1 hour after start)
- All-day option (full day period)
- Multi-day periods (e.g., vacation, projects)
- Duration display (e.g., "2h 30m")
- Overlap detection with other period todos
- Travel time buffer option

**Database Changes:**
```sql
ALTER TABLE todos ADD COLUMN todo_type TEXT DEFAULT 'pending';
-- 'pending', 'due_date', 'period'
ALTER TABLE todos ADD COLUMN start_date DATE;
ALTER TABLE todos ADD COLUMN start_time TIME;
ALTER TABLE todos ADD COLUMN end_date DATE;
ALTER TABLE todos ADD COLUMN end_time TIME;
ALTER TABLE todos ADD COLUMN is_all_day BOOLEAN DEFAULT false;
```

**UI/UX:**
- Type selector in TodoForm: Pending | Due Date | Period
- For Period type: Show start/end pickers
- Calendar view shows periods as blocks
- List view shows time range (e.g., "9:00 AM - 11:00 AM")
- Color coded: Pending (gray), Due Date (green), Period (blue)

---

## 🎯 Implementation Priority

### MVP++ (After Phase 10)
1. Clone/Reuse Todo ⭐
2. Todo Templates
3. Recurring Todos

### Version 1.1
4. **Time Period / Duration Todos** ⭐ (new)
5. Subtasks
6. Tags/Categories

### Version 1.2
7. **Calendar View (Enhanced)** ⭐ (new)
8. Attachments
9. Drag & Drop

### Version 1.3
10. Rich Text
11. Activity Log

---

## 💡 User Requests

**Clone/Reuse Todo** - Requested by user for grocery shopping lists and recurring tasks

**Calendar View + Period Todos** - Requested by user:
- Calendar-like view for appointments
- Todos with periods (from-to time) vs just due dates
- Support for: pending todos, due date todos, period-based todos

---

## 📝 Notes

- All features should maintain multi-language support
- Ensure RLS policies cover new tables/features
- Keep mobile UX in mind
- Consider offline support for mobile apps
- Monitor database performance with new features
