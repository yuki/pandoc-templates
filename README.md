# My custom Pandoc templates
Here you can get my custom Pandoc templates to create HTML (using [Bootstrap 5](https://getbootstrap.com/) with dark-mode, and [Font Awesome](https://fontawesome.com/)) and PDF format files using LaTeX.

## How templates works
There are two templates, the first one to generate HTML and the other to create a custom PDF using LaTeX.

### HTML template
The template is [yuki.html](template/yuki.html), and it uses some files and dependencies from internet:
- Bootstrap 5.3.2
  - External CSS and Javascript from CDN
- Font Awesome 6.4.2 CSS from CDN
  - External CSS and Javascript from CDN
- Custom CSS
  - **template/css/dark_mode.css**: CSS inspired from Bootstrap web page.
  - **template/css/template.css**: custom CSS to create my own custom-boxes.
- Custom Javscript
  - **template/js/dark_mode.js**: inspired from Bootstrap web page and adapted for my own template
  - **template/js/template.js**: custom javascript to adapt generated HTML and to add custom properties.

### LaTeX template
The template is [yuki.tex](template/yuki.tex), which is a modification from my custom [yukibook.cls](https://github.com/yuki/yukibook.cls) class, that I have used to create [my books](https://github.com/yuki/my-books).

The idea is to deprecate [yukibook.cls](https://github.com/yuki/yukibook.cls) and convert my books from LaTeX into Markdown, and use those templates to generate both versions.


<br />

## How to use the templates
Copy the **template/yuki.html** and **template/yuki.tex** files into your **~/.pandoc/templates/** directory. Or you can use those templates cloning this repository.

In this repository there are few files to create an example HTML and PDF file:
- **1.md**: Contains examples of custom images with captions, boxes, ...
- **2.md**: More text
- **metadata.yaml**: netadata file to add author, date, title...
- **book.md**: file which contains in each line previous filenames. The idea is to use this file as a dependency file, to create the generated HTML o PDF.

To create the HTML file:

```
pandoc -o "example.html" --toc -N  --template=template/yuki.html --resource-path=.  $(cat book.md)
```

To create the PDF file: 
```
pandoc -o "example.pdf" --toc -N  --template=template/yuki.tex --resource-path=. --lua-filter=template/filter.lua $(cat book.md)
```


## Example

The result of using this template can be seen in [this page](example.html).

## TO DO list
Right now this is a proof of concept. The idea is to use this template with [my books](https://github.com/yuki/my-books) in order to create a web page whith the LaTeX and HTML results.
