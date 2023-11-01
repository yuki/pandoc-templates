# Custom Pandoc templates
Custom Pandoc templates to create HTML (using [Bootstrap 5](https://getbootstrap.com/) with dark-mode, and [Font Awesome](https://fontawesome.com/)) and PDF format files using LaTeX.

## How templates works
There are two templates, one to generate HTML and one to create a custom PDF using LaTeX.

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


<br /> <br />
## How to use the templates
Copy the **template/yuki.html** and **template/yukibook.tex** files into your **~/.pandoc/templates/** directory. Or you can use those templates cloning this repository.

In this repository there are few files to create an example HTML and PDF file:
- **1.md**: Contains examples of custom images with captions, boxes, ...
- **2.md**: More text
- **metadata.yaml**: netadata file to add author, date, title...
- **book.md**: file which contains in each line previous filenames. The idea is to use this file as a dependency file, to create the generated HTML o PDF.

```
pandoc -o "example.html"   --template=template/yuki.html --number-sections --toc < $(cat book.md)
```

Or using Docker container:

```
docker run --rm \
       --volume "$(pwd):/data" \
       --user $(id -u):$(id -g) \
       pandoc/extra:edge  -o example.html -s --listings --filter pandoc-latex-environment --template=template/yuki.html --toc -N --embed-resources --resource-path=.  $(cat book.md)
```

## Example

The result of using this template can be seen in [this page](example.html).

## TO DO list
Right now this is a proof of concept. The idea is to use this template with [my books](https://github.com/yuki/my-books) in order to create a web page whith the LaTeX and HTML results.
