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


## Day 3 – (Feb 10, 2026)

Time spent: 1 hour
What I built: tokens, secret key, server using secret key generate tokens and later singed with secret to log them in, HTTPBearer to extract token from Authorization header
Hardest part: getting the /me work but turned out I was using the whole json output instead of just the token lol
Concept learned: login, login with token, secret key, authorization header with token and HTTPBearer to extract it
Confidence 1–10: 9


## Day 4 – (Feb 11, 2026)

Time spent: 1 hour
What I built: post creation, schemas, models, foreign key and backpopulates  
Hardest part: all easy but many new things to soak in
Concept learned: foreign key, models, shcemas, db, foreign key - enforces referential integrity, I can't create a post with a user_id that deosn't exist and it defines the relationship between the posts and users tables so joins/relationships make sense
Confidence 1–10: 8

## Day 5 – (Feb 11, 2026)

Time spent: 1 hour
What I built: get posts, delete posts, update posts 
Hardest part: testing in fast api docs haha 
Concept learned: models, schemas, lots of back and forth with routers and services, api testing, authorizattion vs Authentication

Authentication : Who are you?
Authorization: What can you do ? 
401 - unauthorized, 403 - don't exist, 404 - Not allowed 
Confidence 1–10: 9


## Day 6 - Feb 11, 2026

Time spent: 1 hr
Hardest concept: not the hardest but got more familiar with limit and offset
What clicked:limit and offset and pagination and why order_by matters
Confidence: 9.5!


## DAY 7 - Feb 13, 2026
Time spent: 1 hr
Concept: Cursor Pagination and indexing, difference between offset and cursor. Offset walks past the rows but cursor basically helps it jump to the index or cursor and count it from there which makes it much faster. 
what clicked: How the cursor pagination actually works
confidence: 8.5



## Day 8 - Feb 13, 2026 

Concept: N+1 is a load type where it loads or queries one query first to get all the posts and later queries for the number of the posts returned by the first query to get the users of each post. This is not really an effective way of doing it that's why we do joinedload so we get all the information with one singe joined query. 
We will know it's N+1 situation if we are loading a list without joined load or by the count of sql queries that's been evoked. 
EXPLAIN ANALYZE shows you the execution details of the query that's been triggered when an api call is made. 
confidence: 9! 

## Day 9 - Feb 13, 2026 

Concept - Alembic migration. We need to do the slow tracked migration so we don't have to drop the tables every time some schema changes are there. With alembic revision --autogenerate we create a new migration file that compares our current models agaisnt the current schema and writes the diff. and after that alembic upgrade head basically applies that change or migrations to the database, moving it forward to the latest revision. 
confidence: 9!


## Day 10 - Feb 13, 2026 

Concept - Transaction is like this importtant event where you might have to roll back in case all of the activity's process is not complete. flush() helps to keep the partial data in DB without commiting in case we need to rollover if the transaction is not complete. 
confidence: 9! 

## Day 11 - Feb 13, 2026 

Concept - We can also implement a clean and clear way for error handling so it returns a structured result even if it has so many return results, including different kinds of errors. 
confidence: 9! 


## Day 12 - Feb 13, 2026 

Concept - Phew! Middleware and how it runs around every request like a wrapper around the entire API os we put cross-cutting stuff. Logging is very imp cuase it's structured and really helpful in debugging.
Confidence: 9! 


## Day 13 - Feb 13, 2026 
Concept - Redis caching! So basically we storing data temporarily based on keys or other unique key and our apis will hit that or check if it has the required data first before hitting our DB. However, we delete cache after writes so we don't show stale data and same for the scenarios where the data is changed. Learned about serialization too! It's basically converting a Python object into a format that can be stored or sent.

Python obect ----> JSON string
Confidence: 8!

## Day 14 - Feb 13, 2026

Concept - background tasks imporves UX by delaying the not so important or not too long process so the user doesn't have to wait for too long. However, if the process is too long, it's not recommended to use background work. Request work is critical path work and it must finish before the response is returned but background work can happen after the response is returned. If the background work fails, the request should still succeed. 
confidence: 8

## Day 15 - Feb 15, 2026 

Concept - text search  with '%' scans a lot of data so it's very expensive! Query composition is something where we can do lots of filters execution one by one. 
confidence: 7


## Day 16 - Feb 15, 2026 

Concept: Indexing is important cause then the process dones't have to scan the whole data to find something. However, using indexing a lot doesn't help cause that will then slow writing and also takes memory. 

confidence: 8

## Day 17 - Feb 15, 2026

Concept: Rate limiting protects the system from accidental infinite loops from client where they are hitting the server non stop. It also protects from DOS(Deniel of service). Redis is used for this cause it stores counters in memory and supports key experation and INCR and also works across multiple API instances. user based limits authenticated actions and IP-based limits anonymous access. Login endpoints are strict cause they are primary targes for brute-force password attacks. 

confidence: 7.5

## Day 18 - Feb 15, 2026

Concept: We store files in cloud or disk but just path in DB cause storing binary blobs in DB makes it slow, heavy and expensive. So we store files in cloud and return file path instead. 

confidence: 8

## Day 19 - Feb 15, 2026 

Concept: Background tasks run in the API process, queues run in separate worker processes. We can add more workers to handle obs without slowing the API. Redis is perfect for queues cause it provides fast, atomic push/pop operations for job processing. We use queues for slow or non-critical work that doesn't need to block the request.

confidence: 8

## Day 20 - Feb 15, 2026 

Concept: Tests are important cuase they prevent regressions and make systems safe to change. TestClient simulates real API requests without running a server. Unit tests check functions while integration tests check full systems. Auth protects data and must always be reliable. 

Confidence: 7


