namespace backend.Common;

public enum ErrorType
{
    None = 0,
    NotFound = 1,
    Validation = 2,
    Conflict = 3,
    Failure = 4
}

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string Error { get; }
    public ErrorType ErrorType { get; }

    private Result(bool isSuccess, T? value, string error, ErrorType errorType)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        ErrorType = errorType;
    }

    public static Result<T> Success(T value)
        => new(true, value, string.Empty, ErrorType.None);

    public static Result<T> Failure(string error, ErrorType errorType = ErrorType.Failure)
        => new(false, default, error, errorType);

    public static Result<T> NotFound(string error)
        => new(false, default, error, ErrorType.NotFound);

    public static Result<T> Conflict(string error)
        => new(false, default, error, ErrorType.Conflict);
}