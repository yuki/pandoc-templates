if FORMAT:match 'latex' then

  function Span(el)
    beg_v = ""

    if el.classes[1] == "part" then
      beg_v = "\\part{"
    elseif el.classes[1] == "inlineconsole" then
      beg_v = "\\inlineconsole{"
    elseif el.classes[1] == "commandbox" then
      beg_v = "\\commandbox{"
    elseif el.classes[1] == "configfile" then
      beg_v = "\\configfile{"
    elseif el.classes[1] == "configdir" then
      beg_v = "\\configdir{"
    elseif el.classes[1] == "configlink" then
      beg_v = "\\configlink{"
    elseif el.classes[1] == "movie" then
      beg_v = "\\movie{"..el.c[1].target.."}{"
    elseif el.classes[1] == "footnotesize" then
      beg_v = "\\footnotesize{"
    end

    if (beg_v == nil or beg_v == "") then
      -- COLORS
      color = el.attributes['color']
      -- if no color attribute, return unchanged
      if color == nil then return el end

        -- remove color attributes
        el.attributes['color'] = nil
        -- encapsulate in latex code
        table.insert(
          el.content, 1,
          pandoc.RawInline('latex', '\\textcolor{'..color..'}{')
        )
        table.insert(
          el.content,
          pandoc.RawInline('latex', '}')
        )
        return el.content
    else
      return pandoc.RawInline("latex", beg_v..pandoc.utils.stringify(el).."}")
    end
  end

  function Figure(el)
    -- if figure's child is a RawInline is because it has changed in Image
    if el.c[1].c[1].t == "RawInline" then
      return el.c[1].c[1]
    end
  end

  function Div(el)
    beg_v = ""
    end_v = ""

    -- para las customboxes
    if el.classes[1] == "infobox" then
      beg_v = "\\begin{infobox}"
      end_v = "\\end{infobox}"
    elseif el.classes[1] == "warnbox" then
      beg_v = "\\begin{warnbox}"
      end_v = "\\end{warnbox}"
    elseif el.classes[1] == "errorbox" then
      beg_v = "\\begin{errorbox}"
      end_v = "\\end{errorbox}"
    elseif el.classes[1] == "questionbox" then
      beg_v = "\\begin{questionbox}"
      end_v = "\\end{questionbox}"
    elseif el.classes[1] == "exercisebox" then
      beg_v = "\\begin{exercisebox}"
      end_v = "\\end{exercisebox}"
    elseif el.classes[1] == "center" then
      beg_v = "\\begin{center}"
      end_v = "\\end{center}"
    elseif el.classes[1] == "mycode" then
      title = pandoc.utils.stringify(el.c[1])
      language = pandoc.utils.stringify(el.c[2].attr.classes)
      if (el.attributes["size"]) then
        size = el.attributes.size
      else
        size = "normalsize"
      end

      code = el.c[2].text
      -- get mycode block's title
      return pandoc.RawBlock('latex', "\\begin{mycode}{"..title.."}{"..language.."}{\\"..size.."}\n"..code.."\n\\end{mycode}")
    elseif el.classes[1] == "framed" then
      table.insert(el.c[1].c[1].content, 1, pandoc.RawInline("latex", "\\frame{ "))
      table.insert(el.c[1].c[1].content, pandoc.RawInline("latex", " }"))
      return el
    end

    table.insert(el.content, 1, pandoc.RawInline("latex", beg_v))
    table.insert(el.content, pandoc.RawInline("latex", end_v))
    return el
  end

  function Image(el)
    local options = {}

    local caption = ""
    -- Procesar cada elemento del caption para manejar texto y enlaces
    for _, e in ipairs(el.caption) do
      if e.t == "Str" then
        caption = caption .. e.text
      elseif e.t == "Link" then
        local linkText = pandoc.utils.stringify(e.content)
        local url = e.target
        caption = caption .. string.format("\\href{%s}{%s}", url, linkText)
      elseif e.t == "Space" then
        caption = caption .. " "
      end
    end

    -- height = el.attributes.height
    if (el.attributes.width) then
      -- remove the percentage, because in LaTeX make problems
      width = string.gsub(el.attributes.width,"(%%)", "")
      -- convert width XY% into 0.XY
      width = tonumber(width)
      if (width == nil) then
        width = 100.0
      end
      width = width / 100.0 -- "0."..width
      table.insert(options,string.format("width=%s\\linewidth",string.format("%f", width)))
    end
    
    -- height = el.attributes.height
    if (el.attributes.height) then
      -- remove the percentage, because in LaTeX make problems
      height = string.gsub(el.attributes.height,"(%%)", "")
      -- convert height XY% into 0.XY
      height = tonumber(height)
      if (height == nil) then
        height = 100.0
      end
      height = height / 100.0
      table.insert(options,string.format("height=%s\\linewidth",string.format("%f", height)))
    end

    local framed = ""
    if (el.attributes.framed) then
      framed = "frame"
      table.insert(options,framed)
    end

    local float = nil
    for _, v in ipairs(el.classes) do
      if v == "float-left" then
        float = "floatleft"
      elseif v == "float-right" then
        float = "floatright"
      end
    end

    if float ~= nil then
      -- take care of the "," before "frame"
      local latexstring = string.format("\\%s{%s}{%s}{%s}{,%s}",float,width,el.src,caption,framed)
      return pandoc.RawInline("latex", latexstring)
    else
      local includefile = "includegraphics"
      if (string.sub(el.src,-3) == "svg") then
        includefile = "includesvg"
      end
      local latexstring = string.format("\\begin{center} \\%s[%s]{%s} \\captionof{figure}{%s} \\end{center}",includefile,table.concat(options,","),el.src,caption)
      return pandoc.RawInline("latex", latexstring)
    end
  end

end

-- when parsing to HTML
if FORMAT:match 'html' then
  function Span(el)
    color = el.attributes['color']
    -- if no color attribute, return unchanged
    if color == nil then return el end

    -- transform to <span style="color: red;"></span>
      -- remove color attributes
      el.attributes['color'] = nil
      -- use style attribute instead
      el.attributes['style'] = 'color: ' .. color .. ';'
      -- return full span element
      return el
  end

  function CodeBlock(block)
    lang = block.classes[1]
    code = block.text
    filename = "pygmentize.txt"

    file = io.open(filename, "w")
    file:write(code)
    file:close()


    cmd = string.format('pygmentize -l %s -f %s < %s', lang, 'html',filename)
    local proceso = io.popen(cmd, "r") -- Abre el archivo en modo de lectura
    local output = proceso:read('*a')
    proceso:close()
    os.remove(filename)

    texto = '<div class="sourceCode">'..output..'</div>'
    return pandoc.RawBlock('html',texto)
  end
end
