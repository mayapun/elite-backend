class AppException(Exception):
    def __init__(self, message:str, code:str, status_code:int):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundException(AppException):
    def __init__(self, message="Resource not found"):
        super().__init__(message, "NOT_FOUND", 404)

class ForbiddenException(AppException):
    def __init__(self, message="Not allowed"):
        super().__init__(message, "FORBIDDEN", 403)