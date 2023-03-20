# pandoc-template-bootstrap5
A Pandoc template using Bootstrap 5.3 (with dark mode)

## How to use it
Copy the **template/yuki.html** file into your **~/.pandoc/templates/** directory.

Then, you can use the example like:

```
pandoc example.md -o "example.html"   --template=yuki.html --number-sections --toc
```