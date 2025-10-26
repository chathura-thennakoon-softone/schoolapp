namespace SCH.Shared.Exceptions
{
    public class SCHDomainException : SCHException
    {
        public SCHDomainException(string message) : base(message)
        {
        }

        public static void Throw(
            string message, SCHExceptionTypes schExceptionType)
        {
            throw new SCHDomainException(message) 
            { SCHExceptionType = schExceptionType };
        }

        public static SCHDomainException NotFound(
            string message = "Record Not Found")
        {
            return new SCHDomainException(message) 
            { SCHExceptionType = SCHExceptionTypes.NotFound };
        }

        public static SCHDomainException BadRequest(
            string message = "Bad Request")
        {
            return new SCHDomainException(message) 
            { SCHExceptionType = SCHExceptionTypes.BadRequest };
        }

        public static SCHDomainException Conflict(string message)
        {
            return new SCHDomainException(message) 
            { SCHExceptionType = SCHExceptionTypes.Conflict };
        }

        public static SCHDomainException Forbidden(
            string message = "Forbidden")
        {
            return new SCHDomainException(message)
            { SCHExceptionType = SCHExceptionTypes.Forbidden };
        }

        public static SCHDomainException Unauthorized(
            string message = "Unauthorized")
        {
            return new SCHDomainException(message)
            { SCHExceptionType = SCHExceptionTypes.Unauthorized };
        }
    }
}
