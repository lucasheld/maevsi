-- Verify maevsi:enum_event_visibility on pg

BEGIN;

SELECT pg_catalog.has_type_privilege('event_visibility', 'usage');

ROLLBACK;