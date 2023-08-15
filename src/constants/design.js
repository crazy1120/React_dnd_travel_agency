export const surveySetup = {
  code: "Survey",
  rules: [
    { title: "theme", rules: ["theme"] },
    {
      title: "navigation_options",
      key: "navigation",
      rules: [
        "navigationMode",
        "allowPrevious",
        "allowIncomplete",
        "allowJump",
        "skipInvalid",
      ],
    },
    {
      title: "order_priority",
      key: "random",
      rules: ["randomize_groups", "prioritize_groups"],
    },
  ],
};

export const setupOptions = (type) => {
  switch (type) {
    case "group":
    case "welcome":
    case "end":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_questions", "prioritize_questions"],
        },
      ];
    case "text_display":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
      ];
    case "image_display":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
      ];
    case "video_display":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "video_options",
          key: "video_options",
          rules: ["audio_only", "loop"],
        },
      ];
    case "text":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "maxChars", "hint"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_max_char_length",
            "validation_min_char_length",
            "validation_pattern",
            "validation_contains",
            "validation_not_contains",
          ],
        },
      ];
    case "other_text":
      return [
        { title: "setup", key: "setup", rules: ["maxChars"] },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_max_char_length",
            "validation_min_char_length",
            "validation_pattern",
            "validation_contains",
            "validation_not_contains",
          ],
        },
      ];
    case "number":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "maxChars", "hint"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_between",
            "validation_not_between",
            "validation_lt",
            "validation_lte",
            "validation_gt",
            "validation_gte",
            "validation_equals",
            "validation_not_equal",
          ],
        },
      ];
    case "email":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "maxChars", "hint"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_pattern_email",
            "validation_max_char_length",
            "validation_min_char_length",
          ],
        },
      ];
    case "paragraph":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "minRows", "showWordCount", "hint"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_max_word_count",
            "validation_min_word_count",
            "validation_contains",
            "validation_not_contains",
          ],
        },
      ];
    case "file_upload":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_required",
            "validation_file_types",
            "validation_max_file_size",
          ],
        },
      ];
    case "signature":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "photo_capture":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription", "hint"] },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required", "validation_max_file_size"],
        },
      ];
    case "barcode":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription", "hint"] },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "video_capture":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription", "hint"] },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required", "validation_max_file_size"],
        },
      ];
    case "date_time":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: [
            "showDescription",
            "dateFormat",
            "fullDayFormat",
            "maxDate",
            "minDate",
          ],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "date":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "dateFormat", "maxDate", "minDate"],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "time":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "fullDayFormat"],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "scq":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        { title: "skip_logic", key: "skip_logic", rules: ["skip_logic"] },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "image_scq":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "display",
          key: "display",
          rules: ["hideText", "columns", "imageAspectRatio", "spacing"],
        },
        { title: "skip_logic", key: "skip_logic", rules: ["skip_logic"] },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
    case "mcq":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_min_option_count",
            "validation_max_option_count",
            "validation_option_count",
          ],
        },
      ];
    case "ranking":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_min_ranking_count",
            "validation_max_ranking_count",
            "validation_ranking_count",
          ],
        },
      ];
    case "image_ranking":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "display",
          key: "display",
          rules: ["hideText", "columns", "imageAspectRatio", "spacing"],
        },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_min_ranking_count",
            "validation_max_ranking_count",
            "validation_ranking_count",
          ],
        },
      ];
    case "image_mcq":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        { title: "setup", key: "setup", rules: ["showDescription"] },
        {
          title: "display",
          key: "display",
          rules: ["hideText", "columns", "imageAspectRatio", "spacing"],
        },
        {
          title: "order_priority",
          key: "random",
          rules: ["randomize_options", "prioritize_options"],
        },
        {
          title: "validation",
          key: "validation",
          rules: [
            "validation_min_option_count",
            "validation_max_option_count",
            "validation_option_count",
          ],
        },
      ];
    case "scq_array":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "order_priority",
          key: "random",
          rules: [
            "randomize_rows",
            "prioritize_rows",
            "randomize_columns",
            "prioritize_columns",
          ],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required", "validation_one_response_per_col"],
        },
      ];
    case "nps":
      return [
        { title: "show_hide", key: "relevance", rules: ["relevance"] },
        {
          title: "setup",
          key: "setup",
          rules: ["showDescription", "lower_bound_hint", "higher_bound_hint"],
        },
        {
          title: "validation",
          key: "validation",
          rules: ["validation_required"],
        },
      ];
  }
};
