<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $message = $_POST["message"];
  $to = "anjanikmaurya@gmail.com";
  $subject = "New message from $name";
  $body = "Name: $name\nEmail: $email\nMessage:\n$message";
  $headers = "From: $email";

  if (mail($to, $subject, $body, $headers)) {
    echo "Thank you for your message! We'll get back to you soon.";
  } else {
    echo "Sorry, there was an error sending your message. Please try again later.";
  }
}
?>
