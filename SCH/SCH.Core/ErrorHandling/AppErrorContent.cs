namespace SCH.Core.ErrorHandling
{
    public class AppErrorContent
    {
        public required string Message { get; set; }

        public string? Trace { get; set; }
    }
}
