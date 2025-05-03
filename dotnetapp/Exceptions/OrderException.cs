using System;

namespace dotnetapp.Exceptions
{
    public class OrderException : Exception
    {
        public OrderException(string message) : base(message) { }
    }
}
