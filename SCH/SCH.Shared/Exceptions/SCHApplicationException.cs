namespace SCH.Shared.Exceptions
{
    public class SCHApplicationException : SCHException
    {
        public SCHApplicationException(string message) 
            : base(message)
        {
        }

        public SCHApplicationException(
            string message, Exception innerException) 
            : base(message, innerException)
        {
        }

        public static void Throw(
            string message, SCHExceptionTypes schExceptionType)
        {
            throw new SCHApplicationException(message) 
            { SCHExceptionType = schExceptionType };
        }

        public static SCHApplicationException InternalServerError(
            string message = "Internal Server Error")
        {
            return new SCHApplicationException(message) 
            { SCHExceptionType = SCHExceptionTypes.InternalServerError };
        }
    }
}
