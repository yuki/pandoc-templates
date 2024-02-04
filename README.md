# My custom Pandoc templates
Here you can get my custom Pandoc templates to create HTML (using [Bootstrap 5](https://getbootstrap.com/) with dark-mode, and [Font Awesome](https://fontawesome.com/)) and PDF format files using LuaLaTeX.

## Final Results
You can see the final results in [this page](example.html) and in the [example.pdf](example.pdf).

If you want to see real books/html made with this template, here you will see more examples.


# Dependencies
There are two templates, the first one to generate HTML and the other to create a custom PDF using LuaLaTeX.

## HTML template
The template is [template/yuki.html](template/yuki.html), and it uses some files and dependencies from internet:
- Bootstrap 5.3.2
  - External CSS and Javascript from CDN
- Font Awesome 6.4.2 CSS from CDN
  - External CSS and Javascript from CDN
- Custom CSS
  - **template/css/dark_mode.css**: CSS inspired from Bootstrap web page.
  - **template/css/template.css**: custom CSS to create my own custom-boxes.
  - **template/css/pygments/**: Two [Pygments Styles](https://pygments.org/styles/) ("github-dark" and "friendly") for the sourceCode.
- Custom Javscript
  - **template/js/dark_mode.js**: inspired from Bootstrap web page and adapted for my own template
  - **template/js/template.js**: custom javascript to adapt generated HTML and to add custom properties.

## LaTeX template
The template is [template/yuki.tex](template/yuki.tex), which is a modification from my custom [yukibook.cls](https://github.com/yuki/yukibook.cls) class, that I have used to create [my books](https://github.com/yuki/my-books).

The idea is to deprecate [yukibook.cls](https://github.com/yuki/yukibook.cls) and convert my books from LaTeX into Markdown, and use those templates to generate both versions.


<br />

# How to use the templates
Copy the **template/yuki.html** and **template/yuki.tex** files into your **~/.pandoc/templates/** directory. Or you can use those templates cloning this repository.

In this repository there are few files to create an example HTML and PDF file:
- **1.md**: Contains examples of custom images with captions, boxes, ...
- **2.md**: More text
- **book.sh**: It concatenates the previous files and adds "parts".
- **metadata.yaml**: metadata file to add author, date, title...
- **book.yaml**: file which contains the default configuration used to create the generated HTML or PDF.

To create the HTML file:

```
./book.sh | pandoc -o "example.html" -d defaults.yaml
```

If you want to create an embeded HTML file use the extra parameter `--embed-resources=true`.

To create the PDF file: 
```
./book.sh | pandoc -o "example.pdf" -d defaults.yaml --template=template/yuki.tex 
```
