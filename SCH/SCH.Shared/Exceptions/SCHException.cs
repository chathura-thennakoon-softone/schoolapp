namespace SCH.Shared.Exceptions
{
    using System;

    public abstract class SCHException : Exception
    {
        public required SCHExceptionTypes SCHExceptionType { get; set; }

        protected SCHException(string message) : base(message)
        {
        }

        protected SCHException(
            string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }
}
