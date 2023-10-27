# pandoc-template-bootstrap5
A Pandoc template using Bootstrap 5.3 (with dark mode)

## How to use it
Copy the **template/yuki.html** file into your **~/.pandoc/templates/** directory.

Then, you can use the example like:

```
pandoc -o "example.html"   --template=template/yuki.html --number-sections --toc < $(cat book.md)
```

## Example

The result of using this template can be seen in [this page](example.html).

## TO DO list
Right now this is a proof of concept. The idea is to use this template with [my books](https://github.com/yuki/my-books) in order to create a web page whith the LaTeX and HTML results.
