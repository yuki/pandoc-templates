#!/usr/bin/env python3

import panflute as pf
import json
import copy
import os
import re


# return True if has class "solution". For exercisebox
def has_class(elem,class_name):
    if hasattr(elem, "classes") and class_name in elem.classes:
        return True

    if hasattr(elem, "content"):
        return any(has_class(child,class_name) for child in elem.content)

    return False

# return from the elem the class_name and it's child
def extract_by_class(elem, class_name):
    extracted = None

    def action(e, doc):
        nonlocal extracted

        if extracted is None and hasattr(e, "classes") and class_name in e.classes:
            extracted = copy.deepcopy(e)
            return []

    elem.walk(action)
    return extracted


def percent_to_float(text):
    # recibe 38% y devuelve 0.38, pero a veces nos llega "0.3cm" o "1rem"

    text = text.strip().rstrip("%").strip()

    try:
        float(text)
        return str(float(text.strip().rstrip("%").strip()) / 100)
    except ValueError:
        return text


def escape_html(text):
    text = text or ""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )

# return Image cmd for Image and Figure
# FIXME: this should be done in other way?
def get_img_cmd(image):
    width = ''
    height = ''

    if "width" in image.attributes:
        width = " width="+percent_to_float(image.attributes['width'])+"\\linewidth"
    if "height" in image.attributes:
        # TODO: FIXME: some error?
        height = " height="+percent_to_float(image.attributes['height'])

    includefile = "includegraphics"
    if image.url.lower().endswith(".svg"):
        includefile = "includesvg"

    imgcmd = f"\\{includefile}[{width}{height}]{{{image.url}}}"

    if "framed" in image.attributes:
        imgcmd = f"\\fbox{{{imgcmd}}}"

    return imgcmd


def get_table_attributes(caption):
    # get table attributes from the caption
    table_name = colspec = ""
    for item in caption:
        for child in item.content:
            if hasattr(child, "text"):
                # delete "{}" fromt text
                child.text = child.text.replace("{", "")
                child.text = child.text.replace("}", "")
                for pair in re.findall(r"(\w+)=(\S+)", child.text):
                    child.text = ""
                    key, value = pair
                    if key == "tablename":
                        table_name = value
                    elif key == "colspec":
                        colspec = value
    return table_name, colspec


def rows_to_latex(rows):
    output = ""
    if not rows:
        return output

    for row in rows:
        cells = []
        for cell in row.content:
            rendered = pf.convert_text(
                cell.content,
                input_format="panflute",
                output_format="latex"
            )
            cells.append(rendered.strip())

        output += " & ".join(cells) + " \\\\ \n"
    return output


def prepare(doc):
    pass


def action(elem, doc):
    if doc.format == 'latex':
        if isinstance(elem,pf.Span):
            clases = [
                "commandbox",
                "configdir",
                "configfile",
                "configlink",
                "inlineconsole",
                "movie",
                "footnotesize",
                "part",
            ]

            if elem.classes and elem.classes[0] in clases:
                # pf.debug(repr(elem.to_json()))
                # pf.debug(pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex"))
                # pf.debug(pf.convert_text(elem, input_format="panflute",output_format="latex"))

                return pf.RawInline(
                    "\\"+elem.classes[0]
                    +  pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex"),
                    format="latex"
                )

            elif elem.classes and elem.classes[0] == "verbatim":
                return pf.RawInline(
                    "{\\color{inline-code-color}\\fakeverb{"
                    # +  pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex")
                    + pf.stringify(elem)
                    +"}}",
                    format="latex"
                )
            elif elem.attributes and elem.attributes["color"]:
                return pf.RawInline(
                    "\\textcolor{"+elem.attributes["color"]+"}{"
                    +  pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex")
                    + "}",
                    format="latex"
                )


        if isinstance(elem, pf.Div):
            clases = [
                "infobox",
                "warnbox",
                "errorbox",
                "questionbox",
                "gitbox",
                "center"
            ]
            if elem.classes and elem.classes[0] in clases:
                return pf.RawBlock(
                    "\\begin{"+elem.classes[0]+"}\n\n"
                    + pf.convert_text(elem, input_format="panflute",output_format="latex")
                    + "\n\n\\end{"+elem.classes[0]+"}",
                    format="latex"
                )

            elif elem.classes and elem.classes[0] == "exercisebox":
                # needs 2 arguments
                solutions = pf.RawInline(" ")
                if has_class(elem,"solution"):
                    solutions = extract_by_class(elem, "solution")

                return pf.RawBlock(
                    "\\begin{"+elem.classes[0]+"}{"
                       + pf.convert_text(pf.Doc(pf.Para(solutions)), input_format="panflute",output_format="latex")
                    +"}\n"
                      + pf.convert_text(elem, input_format="panflute",output_format="latex")
                    + "\n\\end{"+elem.classes[0]+"}",
                    format="latex"
                )

            elif elem.classes and elem.classes[0] == "mycode":
                title = pf.convert_text(elem.content[0], input_format="panflute",output_format="latex")
                language = elem.content[1].classes[0]
                size = "normalsize"
                if elem.attributes and elem.attributes["size"]:
                    size = elem.attributes["size"]
                return pf.RawBlock(
                    "\\begin{mycode}{"+title+"}{"+language+"}{\\"+size+"}\n"
                    + elem.content[1].text
                    + "\n\\end{mycode}",
                    format="latex"
                )

            elif elem.classes and elem.classes[0] == "column":
                # FOR COLUMNS
                # https://superuser.com/questions/1682413/two-columns-pdf-from-markdown-with-pandoc-and-lua-script
                width = 1.0
                if elem.attributes and elem.attributes.get("width"):
                    width = percent_to_float(elem.attributes["width"])
                return pf.RawBlock(
                    "\\begin{minipage}{" + str(width) + "\\linewidth}\n"
                    + "\\setlength{\\parskip}{1.2em}\n"
                    + pf.convert_text(elem, input_format="panflute", output_format="latex")
                    + "\n\\end{minipage}",
                    format="latex"
                )
            elif elem.classes and elem.classes[0] == "columns":
                # merge consecutive minipage blocks to avoid extra blank space
                blocks = []
                for child in elem.content:
                    # FIXME:  this if does nothing
                    if hasattr(child, "t") and child.t == "Para":
                        blocks.append(child)
                    else:
                        blocks.append(child)

                merged_text = ""
                for idx, child in enumerate(blocks):
                    if idx > 0:
                        merged_text += "\\hfill\n"
                    merged_text += pf.convert_text(child, input_format="panflute", output_format="latex")

                return pf.RawBlock(
                    "\\vspace{5pt}\n"
                    + merged_text
                    + "\\vspace{5pt}\n",
                    format="latex"
                )

        elif isinstance(elem,pf.Figure):
            image = elem.content[0].content[0]
            # pf.debug(image)
            # pf.stringify(image)
            # imgcmd =  get_img_cmd(image)

            block_begin = "\\begin{center}\n"
            block_end = "\n\\end{center}"
            if "inline" in elem.attributes:
                block_begin = ""
                block_end = ""
            
            #FIXME: if not inline image, because it's called to pf.Image below, there are two \begin{center} and \end{center}
            return pf.RawBlock(
                    block_begin
                    + pf.stringify(image)
                    + "\\captionof{figure}{"
                    + pf.convert_text(elem.caption.content, input_format="panflute",output_format="latex")
                    + "}\n"
                    + block_end,
                    format="latex"
                )

        elif isinstance(elem,pf.Image):
            imgcmd =  get_img_cmd(elem)
            block_begin = "\\begin{center}\n"
            block_end = "\n\\end{center}"
            if "inline" in elem.attributes:
                block_begin = ""
                block_end = ""
            return pf.RawInline(
                    block_begin
                    + imgcmd 
                    + block_end,
                    format="latex"
                )

        elif isinstance(elem,pf.Table):
            table_name = "yukitblr"
            colspec = ""
            col_specs_in_table = ""
            caption = ""

            if elem.colspec:
                # table original colspec, made in markdown
                for col_spec in elem.colspec:
                    align = col_spec[0] if isinstance(col_spec, (list, tuple)) else "AlignCenter"
                    width = col_spec[1] if isinstance(col_spec, (list, tuple)) and len(col_spec) > 1 else None

                    col_specs_in_table += "X["
                    # FIXME: ignoring width
                    # if width not in (0, None):
                    #     col_specs_in_table += str(width) + "\\linewidth,"
                    if align == "AlignLeft":
                        col_specs_in_table += "l"
                    elif align == "AlignRight":
                        col_specs_in_table += "r"
                    else:
                        col_specs_in_table += "c"

                    col_specs_in_table += "]"

            # pf.debug(elem.caption.content)
            if elem.caption and elem.caption.content:
                # we get "tablename=" and "colspec=" from caption, hardcoded in markdown table's content
                table_name, colspec = get_table_attributes(elem.caption.content)
                # the caption cane be setted because "tablename=.." and "colspec=.." are deleted
                caption = pf.convert_text(pf.Doc(pf.Div(elem.caption.content[0])), input_format="panflute",output_format="latex")

            if colspec == "":
                # if not hardcoded colspec, we get from table
                colspec = col_specs_in_table

            # HEADER
            head = rows_to_latex(elem.head.content)
            body = rows_to_latex(elem.content[0].content)
            foot = rows_to_latex(elem.foot.content)

            return pf.RawBlock(
                    "\\begin{"+table_name+"}[caption="+caption+"]{"+colspec+"}\n"
                    + head
                    + body
                    + foot
                    + "\\end{"+table_name+"}",
                    format="latex"
                )


    elif doc.format == 'html':
        if isinstance(elem,pf.Span):
            if elem.attributes and elem.attributes["color"]:
                elem.attributes["style"] =  "color: "+elem.attributes["color"]
            if elem.classes and elem.classes[0] == "verbatim":
                return pf.RawInline(
                    "<span class='verbatim'>"
                    +  escape_html(pf.stringify(elem))
                    +"</span>",
                    format="html"
                )
        elif isinstance(elem,pf.CodeBlock):
            lang = elem.classes[0]
            code = elem.text
            filename = "pygmentize.txt"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(code)
                f.close()
            cmd = "pygmentize -l "+lang+" -f html pygmentize.txt"
            html = pf.shell(cmd).decode('utf-8')
            os.remove(filename)

            return pf.RawBlock(
                '<div class="sourceCode">'
                + str(html)
                + '</div>',
                format="html"
            )

        elif isinstance(elem,pf.Table):
            caption = elem.caption
            table_name = colspec = ""
            table_name, colspec = get_table_attributes(elem.caption.content)
            elem.attributes["data-tablename"] = table_name
            elem.attributes["data-colspec"] = colspec


def finalize(doc):
    pass


def main(doc=None):
    return pf.run_filter(action,
                         prepare=prepare,
                         finalize=finalize,
                         doc=doc) 


if __name__ == '__main__':
    main()

