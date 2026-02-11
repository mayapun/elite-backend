## Day 1 – (Feb 10, 2026)

Time spent: 2 hours
What I built: created a skeleton, postgresql db, users table, inserted two users by creating an API to post users
Bugs I hit: nothing
Concepts learned: docker, container for db via docker, fast api, get_db session to get unique db session
Things I didn’t understand: all set with today's plan
Tomorrow’s focus: routers, schemas,password hashing, real signup/login, proper structure

Confidence (1–10): 8.5 

## Day 2 – (Feb 10, 2026)

Time spent: 1 hour
What I built: signup and login page, password hashing
Hardest part: making signup and login pages work
Concept learned: password hashing and routers and services
Confidence 1–10: 8

1. Why we use schemas instead of models
    We use schemas for data validation/serialization and for API input/output but we use models for database structure and DB operations
2. Why passwords are hashed
    To protect password with extra security
3. What service layer does
    It's for business logic and database operations(internal)
4. What router layer does
    It's for API endpoints and request handling 
5. Flow of signup request
    POST request -> router to endpoint -> DB session -> check email -> service creates user(hashes password, saves to DB) -> response with user info 
    
     

