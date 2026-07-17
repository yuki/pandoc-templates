# My custom Pandoc templates

I have created two Pandoc templates to create HTML (using [Bootstrap 5](https://getbootstrap.com/) with dark-mode, and [Font Awesome](https://fontawesome.com/)) and PDF files using LuaLaTeX.

## Final Results
You can see the final results in [this web](https://yuki.github.io/pandoc-templates/example.html) and in the [example.pdf](https://yuki.github.io/pandoc-templates/example.pdf).

If you want to see real books/html made with those templates [here](https://yuki.github.io/my-books/) are more examples that I use as a teacher.


# Dependencies
There are two templates, the first one to generate HTML and the other to create a custom PDF using LuaLaTeX.

## Pandoc filter

Because I have created custom boxes/styles that doesn't have by default, I have created a filter to parse the initial markdown file to create the final HTML and LaTeX (to create the PDF).

- [template/filter.py](template.filter.py): the Python filter. It needs [Panflute package](https://scorreia.com/software/panflute/index.html) that makes Pandoc filters easy to use. Python is easier than Lua and Panflute allows some features (like **pf.convert_text**) that Lua filters cannot made by default.

- [template/filter.py](template.filter.lua): **DEPRECATED in 2026-07-17**. This was the original filter, but was very difficult to add new features, and because Lua isn't very friendly, I created the Python version. In near future I'll delete this file.


## HTML template
The template is [template/yuki.html](template/yuki.html), and it uses some files and dependencies from internet:
- Bootstrap 5.3.2
  - External CSS and Javascript from CDN
- Font Awesome 7.0 CSS from CDN
  - External CSS and Javascript from CDN
- Custom CSS
  - **template/css/dark_mode.css**: CSS inspired from Bootstrap web page.
  - **template/css/template.css**: custom CSS to create my own custom-boxes, tables, ...
  - **template/css/pygments/**: Two [Pygments Styles](https://pygments.org/styles/) ("github-dark" and "friendly") for the sourceCode.
- Custom Javscript
  - **template/js/dark_mode.js**: inspired from Bootstrap web page and adapted for my own template
  - **template/js/template.js**: custom javascript to adapt generated HTML and to add custom properties.

## LaTeX template

The template is [template/yuki.tex](template/yuki.tex), which is a modification from my custom old [yukibook.cls](https://github.com/yuki/yukibook.cls) class.


<br />

# How to use the templates
Copy the **template/yuki.html** and **template/yuki.tex** files into your **~/.pandoc/templates/** directory. Or you can use those templates cloning this repository.

To use custom features (like **mycode**, **infobox**, **configdir**, columns and tables ...) see the 1.md and 2.md markdown files.

In this repository there are few files to create an example HTML and PDF file:
- **1.md**: Contains examples of custom captions, boxes, ...
- **2.md**: Columns and tables examples.
- **book.sh**: It concatenates the previous files and adds "parts".
- **metadata.yaml**: metadata file to add author, date, title...
- **defaults.yaml**: file which contains the default configuration used to create the generated HTML and PDF.

## HTML
To create the HTML file:

```
./book.sh | pandoc -o "example.html" -d defaults.yaml
```

If you want to create an embeded HTML file use the extra parameter `--embed-resources=true`.

## PDF

To create the PDF file: 
```
./book.sh | pandoc -o "example.pdf" -d defaults.yaml --template=template/yuki.tex 
```

The `--template=template/yuki.tex` is needed because in the `defaults.yaml` the default filter is HTML file. Change the path if you have moved to other path.
