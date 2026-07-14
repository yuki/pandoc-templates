#!/usr/bin/env python3

import panflute as pf
import json
import copy


# return True if has class "solution". For exercisebox
def has_solution_class(elem):
    if hasattr(elem, "classes") and "solution" in elem.classes:
        return True

    if hasattr(elem, "content"):
        return any(has_solution_class(child) for child in elem.content)

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
    # recibe 38% y devuelve 0.38
    return str(float(text.strip().rstrip("%").strip()) / 100)


def prepare(doc):
    pass


def action(elem, doc):
    if doc.format == 'latex':
        if isinstance(elem,pf.Span):
            clases = [
                "color",
                "commandbox",
                "configdir",
                "configfile",
                "configlink",
                "inlineconsole",
                "movie",
                "footnotesize",
                "part",
            ]
            # pf.debug(elem.classes)
            if elem.classes and elem.classes[0] in clases:
                # pf.debug(repr(elem.to_json()))
                # pf.debug(pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex"))
                # pf.debug(pf.convert_text(elem, input_format="panflute",output_format="latex"))

                return pf.RawInline(
                    "\\"+elem.classes[0]
                    +  pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex"),
                    format="latex"
                )
            elif elem.classes and elem.classes[0] == "Verbatim":
                return pf.RawInline(
                    "\\color{inline-code-color}\\fakeverb"
                    +  pf.convert_text(pf.Doc(pf.Para(elem)), input_format="panflute",output_format="latex"),
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
                    "\\begin{"+elem.classes[0]+"}\n"
                    + pf.convert_text(elem, input_format="panflute",output_format="latex")
                    + "\n\\end{"+elem.classes[0]+"}",
                    format="latex"
                )

            elif elem.classes and elem.classes[0] == "exercisebox":
                # needs 2 arguments
                solutions = pf.RawInline(" ")
                if has_solution_class(elem):
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

            # elif elem.classes and elem.classes[0] == "column":
            #     # FOR COLUMNS
            #     # https://superuser.com/questions/1682413/two-columns-pdf-from-markdown-with-pandoc-and-lua-script
            #     width = 100
            #     if elem.attributes and elem.attributes["width"]:
            #         width = percent_to_float(elem.attributes["width"])
            #     return pf.RawBlock(
            #         "\\begin{minipage}{"+width+"\\linewidth}\n\\setlength{\\parskip}{1.2em}\n"
            #         + pf.convert_text(elem, input_format="panflute",output_format="latex")
            #         + "\n\\end{minipage}",
            #         format="latex"
            #     )
            # elif elem.classes and elem.classes[0] == "columns":
            #     # pf.debug(elem)
            #     return pf.RawBlock(
            #         "\\vspace{5pt}"
            #         + pf.convert_text(elem, input_format="panflute",output_format="latex")
            #         + "\\vspace{5pt}",
            #         format="latex"
            #     )

            
        # elif isinstance(elem,pf.Figure):
        #     # pf.debug(pf.convert_text(elem.caption.content,input_format="markdown",output_format="latex"))
        #     pf.debug(elem.caption.content)
        #     uno = pf.RawBlock(
        #             "\\captionof{figure}{"
        #             + pf.convert_text(elem.caption.content, input_format="panflute",output_format="latex")
        #             + "}",
        #             format="latex"
        #         )
        #     return uno 


    elif doc.format == 'html':
        pf.debug("HTML")



def finalize(doc):
    pass


def main(doc=None):
    return pf.run_filter(action,
                         prepare=prepare,
                         finalize=finalize,
                         doc=doc) 


if __name__ == '__main__':
    main()

