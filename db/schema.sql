-- School Result Processing and GPA Engine -- schema
-- Marks are stored raw. Every grade point, GPA and checking list is derived
-- by lib/grading.ts at read time, so the engine is the single source of truth.

drop table if exists marks cascade;
drop table if exists students cascade;
drop table if exists subjects cascade;
drop table if exists classes cascade;

create table classes (
  id          serial primary key,
  code        text not null unique,
  name        text not null,
  group_name  text not null
);

create table subjects (
  id             serial primary key,
  class_id       int  not null references classes(id) on delete cascade,
  code           text not null,
  name           text not null,
  is_optional    boolean not null default false,
  has_practical  boolean not null default false,
  theory_full    int  not null,
  theory_pass    int  not null,
  practical_full int  not null default 0,
  practical_pass int  not null default 0,
  ordinal        int  not null,
  unique (class_id, code)
);

create table students (
  id             serial primary key,
  class_id       int  not null references classes(id) on delete cascade,
  roll           int  not null,
  name           text not null,
  edge_case_note text,
  unique (class_id, roll)
);

create table marks (
  id             serial primary key,
  student_id     int  not null references students(id) on delete cascade,
  subject_id     int  not null references subjects(id) on delete cascade,
  theory_mark    int,                      -- null when the student was absent
  practical_mark int,                      -- null when absent or no practical part
  is_absent      boolean not null default false,
  unique (student_id, subject_id),
  constraint marks_absent_has_no_marks
    check (not is_absent or (theory_mark is null and practical_mark is null))
);

create index marks_student_idx on marks(student_id);
create index students_class_idx on students(class_id);
create index subjects_class_idx on subjects(class_id);
